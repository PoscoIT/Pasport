import {useEffect, useState} from "react";
import { DataTable } from 'react-native-paper';
import {SafeAreaView, ScrollView, Text} from "react-native";
import XLSX from 'xlsx';
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import {t} from "i18next";
const FoodMenu = ()=>{
    const numberOfItemsPerPageList = [11, 3, 4];
    const [page, setPage] = useState(0);
    const [netInfo, setNetInfo] = useState('');
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
    const isLocalIP = netInfo?.startsWith('172');
    const url = 'https://tstapp.poscoassan.com.tr:8443';
    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth()+1)?.toString().padStart(2,0)
    const day = (date.getDate())?.toString().padStart(2,0)


    const [items] = useState([
        {
            key: 1,
            name: 'Romen Çorbası',
        },
        {
            key: 2,
            name: 'Kaşarlı Domates Çorbası',
        },
        {
            key: 3,
            name: 'Kayseri Köfte',
        },
        {
            key: 4,
            name: 'Barbekü Soslu Piliç',
        },
        {
            key: 5,
            name: 'Domatesli Erişte',
        },
        {
            key: 6,
            name: 'Fırın Sütlaç',
        },
        {
            key: 7,
            name: 'Un Helvası',
        },
        {
            key: 8,
            name: 'Meyve',
        },
        {
            key: 9,
            name: 'Komposto/Yoğurt',
        },
        {
            key: 10,
            name: 'Ayran',
        },
        {
            key: 11,
            name: "Salata/Zy.Brokoli/Haydari",
        },
        {
            key: 12,
            name: 'Kalgusu',
        },
        {
            key: 13,
            name: 'Bab',
        },
        {
            key: 14,
            name: "Godino Gui",
        },
    ]);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    const convertExcelToJson = async () => {
        try {
            const response = await axios.get(`${url}/images/HR/${year}_${month}.xlsx`, {
                responseType: 'arraybuffer'
            });

            const data = new Uint8Array(response.data);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            console.log(jsonData)
            // Burada jsonData değişkeni JSON formatına dönüştürülmüş veriyi içerir

        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener(state => {
            setNetInfo(state.details.ipAddress);
        });

        return () => {
            // Unsubscribe to network state updates
            unsubscribe();
        };
    }, []);

    useEffect(()=>{
        setPage(0);
    },[itemsPerPage])
    return(
        <ScrollView>
            <Text style={{fontSize:16,textAlign:"center",marginVertical:5}}>{day}-{month}-{year}</Text>
            <DataTable>
                <DataTable.Header>
                    {page===0? <DataTable.Title >{t("foodMenu.turkishMenu")}</DataTable.Title>:null}
                    {page===1? <DataTable.Title >{t("foodMenu.koreanMenu")}</DataTable.Title>:null}


                </DataTable.Header>

                {items.slice(from, to).map((item) => (
                    <DataTable.Row key={item.key}>
                        <DataTable.Cell>{item.name}</DataTable.Cell>

                    </DataTable.Row>
                ))}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(items.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${items.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={'Rows per page'}
                />
            </DataTable>
        </ScrollView>

    )
}
export default FoodMenu