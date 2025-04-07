import React, { useContext } from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { AuthContext } from '../../context/authContext'
function AdminReport({ navigation }: any) {
    const { user } = useContext(AuthContext)
    const [report, setReport] = useState([])

    useEffect(() => {
        const getReport = async () => {
            try {
                const res = await axios.get
                    ('https://marvelous-gentleness-production.up.railway.app/api/Report/GetAllReport',
                        {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        }
                    )
                setReport(res.data)
            } catch (error) {
                console.log('Can not get report')
            }
        }
        getReport()
    }, [])

    return (

        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text >← Quay lại</Text>
        </TouchableOpacity>

    )
}

export default AdminReport
