import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Box from "@mui/system/Box"
import { PieChart } from "@mui/x-charts/PieChart"
import { useState, useEffect } from "react"
import { Trans, useTranslation } from "react-i18next"
import axios from "axios"
import { LinearProgress } from "@mui/material"

interface PieData {
    candidate_1: number,
    candidate_2: number,
    candidate_3: number,
    count: number
}

function Home({ setAction }: { setAction: (action: 'home' | 'contribute' | 'verified') => void }) {
    const { t } = useTranslation()
    const [pieData, setPieData] = useState<PieData | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('/pie_chart')
            setPieData(response.data)
        }
        fetchData()
    }, [])

    return (
        <>
            <Typography variant="h1" component="h1" sx={{ textAlign: 'center', mt: 1 }} fontSize={30}>
                {t('home.title')}
            </Typography>
            <Typography variant="h2" component="h2" sx={{ textAlign: 'center' }} fontSize={18}>
                <Trans
                    i18nKey="home.disclaimer"
                    components={{
                        sirekap: <a href="https://pemilu2024.kpu.go.id/"></a>
                    }}
                />
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {pieData != null ? <PieChart
                    sx={{ mt: 2 }}
                    series={[
                        {
                            data: [
                                { id: 0, value: pieData.candidate_1, label: t('contribute.candidate.one') },
                                { id: 1, value: pieData.candidate_2, label: t('contribute.candidate.two') },
                                { id: 2, value: pieData.candidate_3, label: t('contribute.candidate.three') },
                            ],
                        },
                    ]}
                    width={500}
                    height={200}
                /> : "loading"}
            </Box>
            <Box sx={{ maxWidth: 700, margin: 'auto', mt: 2 }}>
                <Box sx={{ml: 2, mr: 2}}>
                <LinearProgress variant="determinate" value={(pieData?.count || 0 / 823236) * 100} />
                </Box>
            </Box>
            <Typography sx={{ textAlign: 'center', mt: 1 }}>
                ({pieData?.count || 0} / 823236) {t('home.checked')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <Button variant="contained" color="primary" onClick={() => setAction('contribute')}>
                    {t('home.contribute')}
                </Button>

            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                <Button variant="contained" color="success" onClick={() => setAction('verified')}>
                    {t('home.verified')}
                </Button>
            </Box >

        </>
    )
}

export default Home