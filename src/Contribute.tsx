import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import axios, { AxiosError } from 'axios'
import { Dialog, ImageList, ImageListItem, Pagination, TextField, useMediaQuery } from "@mui/material"
import ReCAPTCHA from "react-google-recaptcha"
import { toast } from "react-toastify"
import ReactGa from 'react-ga4'
import Gauge from "./Gauge"

interface Sheet {
    imageURL: string,
    id: string
}

const levels = [
    { value: 0, label: 'Beginner' },
    { value: 20, label: 'Intermediate' },
    { value: 50, label: 'Advanced' },
    { value: 100, label: 'Expert' },
    { value: 200, label: 'Master' },
    { value: 500, label: 'Master+' },
    { value: 1000, label: 'Master+' },
]

function getLevel(value: number) {
    for (let i = 0; i < levels.length; i++) {
        if (value < levels[i].value) {
            return levels[i - 1].label
        }
    }
    return levels[levels.length - 1].label
}

function getNextLevelBoundary(value: number) {
    for (let i = 0; i < levels.length; i++) {
        if (value < levels[i].value) {
            return levels[i].value
        }
    }
    return levels[levels.length - 1].value
}

function getContributionsToNextLevel(value: number) {
    return getNextLevelBoundary(value) - value
}

function getNumberFromLocalStorage(key: string, defaultValue: number): number {
    const value = localStorage.getItem(key)
    if(value === null) {
        return defaultValue
    }
    return parseInt(value)
}

function setNumberToLocalStorage(key: string, value: number) {
    localStorage.setItem(key, value.toString())
}

function Contribute() {
    const { t } = useTranslation()

    const [page, setPage] = useState<number>(1)
    const [pageCount, setPageCount] = useState<number>(1)
    const [sheets, setSheets] = useState<Sheet[]>([])
    const [selectedSheet, setSelectedSheet] = useState<Sheet | null>(null)

    const [contributed, setContributed] = useState<number>(getNumberFromLocalStorage('contributed', 0))

    useEffect(() => {
        setNumberToLocalStorage('contributed', contributed)
    }, [contributed])

    useEffect(() => {
        ReactGa.send({ hitType: 'pageview', page: '/contribute', title: 'Contribute' })
    },[])

    const fetchData = useCallback(async () => {
        const result = await axios.get(`/sheets/unverified/${page}`)
        setSheets(result.data.sheets)
        setPageCount(result.data.pages)
    }, [page])

    useEffect(() => {
        fetchData()
    }, [fetchData, page])

    useEffect(() => {
        if(selectedSheet !== null) {
            ReactGa.send({ hitType: 'pageview', page: `/contribute/${selectedSheet.id}`, title: `Contribute ${selectedSheet.id}` })
        }
    }, [selectedSheet])

    const wideScreen = useMediaQuery('(min-width:600px)')

    async function submitSheet() {

        if(candidateOneVotes + candidateTwoVotes + candidateThreeVotes === 0) {
            toast.error(t('contribute.no-votes'))
            return
        }

        ReactGa.event("contributed")
        setContributed(contributed + 1)

        try {
            await axios.post(
                `/sheet/${selectedSheet?.id}`,
                {
                    candidate1: candidateOneVotes,
                    candidate2: candidateTwoVotes,
                    candidate3: candidateThreeVotes,
                    captcha: captchaToken
                }
            );
            toast.success(t('contribute.success'))
            setSelectedSheet(null)
            fetchData()
        } catch (error) {
            const errorResponse = error as AxiosError
            if(errorResponse.response === undefined) {
                toast.error('contribute.failed-to-connect')
                return
            }
            switch (errorResponse.response.status) {
                case 400:
                    toast.error(t('contribute.captcha-failed'))
                    break
                case 403:
                    toast.error(t('contribute.already-contributed'))
                    break
                case 404:
                    toast.error(t('contribute.not-found'))
                    break
                default:
                    toast.error(t('contribute.unknown-error'))
            }
            setSelectedSheet(null)
            fetchData()

        }

        setCandidateOneVotes(0)
        setCandidateTwoVotes(0)
        setCandidateThreeVotes(0)
    }

    

    const [candidateOneVotes, setCandidateOneVotes] = useState<number>(0)
    const [candidateTwoVotes, setCandidateTwoVotes] = useState<number>(0)
    const [candidateThreeVotes, setCandidateThreeVotes] = useState<number>(0)
    const [captchaToken, setCaptchaToken] = useState<null | string>(null)

    return (
        <>
            <Typography variant="h1" component="h1" sx={{ textAlign: 'center', mt: 1 }} fontSize={26}>
                {t('contribute.title')}
            </Typography>
            <Typography variant="h2" component="h2" sx={{ textAlign: 'center' }} fontSize={18}>
                {t('contribute.info')}
            </Typography>

            <Gauge
                value={contributed}
                label={getLevel(contributed)}
                max={getNextLevelBoundary(contributed)}
                units={`${getContributionsToNextLevel(contributed)} solves to next level`}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} />
            </Box>
            <ImageList cols={wideScreen? 5: 3}>
                {
                    sheets.map((sheet) => (
                        <ImageListItem key={sheet.id}>
                            <img src={sheet.imageURL} alt={sheet.id} onClick={() => setSelectedSheet(sheet)} />
                        </ImageListItem>
                    ))
                }
            </ImageList>
            <Box sx={{ display: 'flex', justifyContent: 'center'}}>
            <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} />
            </Box>

            <Dialog open={selectedSheet !== null} onClose={() => setSelectedSheet(null)}>
                <Typography variant="h2" component="h2" sx={{ textAlign: 'center' }} fontSize={18}>
                    {t('contribute.scroll-help')}
                </Typography>
                <img src={selectedSheet?.imageURL} alt={selectedSheet?.id} />
                <TextField sx={{mt:2}} label={t('contribute.candidate.one')} onChange={(e) => setCandidateOneVotes(parseInt(e.target.value))}/>
                <TextField sx={{mt:1}} label={t('contribute.candidate.two')} onChange={(e) => setCandidateTwoVotes(parseInt(e.target.value))}/>
                <TextField sx={{mt:1}} label={t('contribute.candidate.three')} onChange={(e) => setCandidateThreeVotes(parseInt(e.target.value))}/>
                <Box sx={{display:'flex', justifyContent:'center', mt: 1}}>
                <ReCAPTCHA size="normal" sitekey="6LeQincpAAAAAFvbCzBba3KHNIcFAfQlo1cUa8R-" onErrored={() => console.log('errored')} onChange={(token) => setCaptchaToken(token)} />
                </Box>
                <Button sx={{mt: 1}} variant="contained" color="primary" onClick={() => submitSheet()}>
                    {t('contribute.submit')}
                </Button>
                <Button sx={{mt: 0.5}} variant="contained" color="error" onClick={() => setSelectedSheet(null)}>
                    {t('contribute.cancel')}
                </Button>
            </Dialog>
        </>
    )
}

export default Contribute