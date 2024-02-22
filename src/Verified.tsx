import { Box, Button, Dialog, ImageList, ImageListItem, Pagination, Typography } from '@mui/material';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactGa from 'react-ga4';

interface Sheet {
    imageURL: string,
    id: string
}

interface SheetDetailed {
    imageURL: string,
    verified: boolean,
    canReview: boolean,
    votes: [number, number, number]
}

function Verified() {
    const { t } = useTranslation();

    const [page, setPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(1);
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [selectedSheet, setSelectedSheet] = useState<Sheet | null>(null);
    const [selectedSheetDetailed, setSelectedSheetDetailed] = useState<SheetDetailed | null>(null);

    const fetchData = useCallback(async () => {
        const result = await axios.get(`/sheets/verified/${page}`);
        setSheets(result.data.sheets);
        setPageCount(result.data.pages);
    }, [page])

    useEffect(() => {
        fetchData();
    }, [page, fetchData])

    useEffect(() => {
        ReactGa.send({ hitType: 'pageview', page: '/verified', title: 'Verified' })
    },[])

    useEffect(() => {
        if (selectedSheet !== null) {
            axios.get(`/sheet/${selectedSheet.id}`)
                .then((response) => setSelectedSheetDetailed(response.data))
            ReactGa.send({ hitType: 'pageview', page: `/verified/${selectedSheet.id}`, title: `Verified ${selectedSheet.id}` })
        } else {
            setSelectedSheetDetailed(null);
        }
    }, [selectedSheet]);

    return (
        <>
            <Typography variant="h1" component="h1" sx={{ textAlign: 'center', mt: 1 }} fontSize={30}>
                {t('verified.title')}
            </Typography>
            <Typography variant="h2" component="h2" sx={{ textAlign: 'center' }} fontSize={18}>
                {t('verified.disclaimer')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} />
            </Box>
            <ImageList cols={3}>
                {
                    sheets.map((sheet) => (
                        <ImageListItem key={sheet.id}>
                            <img src={sheet.imageURL} alt={sheet.id} onClick={() => setSelectedSheet(sheet)} />
                        </ImageListItem>
                    ))
                }
            </ImageList>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} />
            </Box>

            <Dialog open={selectedSheet !== null} onClose={() => setSelectedSheet(null)}>
                <Typography variant="h2" component="h2" sx={{ textAlign: 'center' }} fontSize={18}>
                    {t('verified.scroll-help')}
                </Typography>
                <img src={selectedSheet?.imageURL} alt={selectedSheet?.id} />
                <Typography variant="h2" component="h2" sx={{ textAlign: 'center' }} fontSize={18}>
                    {t('verified.candidate.one')}: {selectedSheetDetailed?.votes[0]}
                </Typography>
                <Typography variant="h2" component="h2" sx={{ textAlign: 'center' }} fontSize={18}>
                    {t('verified.candidate.two')}: {selectedSheetDetailed?.votes[1]}
                </Typography>
                <Typography variant="h2" component="h2" sx={{ textAlign: 'center' }} fontSize={18}>
                    {t('verified.candidate.three')}: {selectedSheetDetailed?.votes[2]}
                </Typography>
                <Button sx={{ mt: 0.5 }} variant="contained" color="error" onClick={() => setSelectedSheet(null)}>
                    {t('verified.close')}
                </Button>
            </Dialog>
        </>
    )
}

export default Verified;