import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    useWindowDimensions,
} from 'react-native';

export default function OverView({ project }: any) {
    const { width } = useWindowDimensions();

    if (!project) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Đang tải dữ liệu...</Text>
            </View>
        );
    }

    const progress = (project["total-amount"] / project["minimum-amount"]) * 100;
    const endDate = new Date(project["end-datetime"]);
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();
    const daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

    return (
        <View style={{ flex: 0.9 }}>
            <ScrollView style={styles.container}>
                <View style={{ flex: 0.7 }}>
                    <Text style={styles.title}>{project.title}</Text>
                    <Text style={{ fontWeight: '400', fontSize: 15, marginBottom: 10 }}>
                        Create by {'\n'}
                        <Text style={{ fontWeight: '900', fontSize: 18 }}>{project.creator}</Text>
                    </Text>
                    <Text style={{ fontWeight: '300', marginBottom: 20 }}>{project.description}</Text>
                    <View style={{ marginTop: 8 }}>
                        <View style={{ height: 4, backgroundColor: '#ccc', borderRadius: 2, overflow: 'hidden' }}>
                            <View
                                style={{
                                    height: '100%',
                                    width: `${Math.min(progress, 100)}%`,
                                    backgroundColor: '#028760',
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ marginTop: 4 }}>
                            <Text style={{ color: '#028760', fontWeight: '600' }}>
                                {Math.floor(progress)}% {'\n'}funded
                            </Text>
                        </View>

                        <View style={{ marginTop: 4, marginLeft: 10 }}>
                            <Text style={{ color: '#00246B', fontWeight: 'bold' }}>
                                <Text>{project.backers || 0}{'\n'}</Text>
                                {(project.backers || 0) <= 1 ? 'Backer' : 'Backers'}
                            </Text>
                        </View>

                        <View style={{ marginTop: 4, marginLeft: 10 }}>
                            <Text style={{ color: '#00246B', fontWeight: 'bold' }}>
                                <Text>{project['minimum-amount']} ${'\n'}</Text>Goal
                            </Text>
                        </View>

                        <View style={{ marginTop: 4, marginLeft: 10 }}>
                            <Text style={{ color: '#00246B', fontWeight: 'bold' }}>
                                <Text>{project['total-amount']} ${'\n'}</Text>Gain
                            </Text>
                        </View>

                        <View style={{ marginTop: 4, marginLeft: 10 }}>
                            <Text style={{ color: '#00246B', fontWeight: 'bold' }}>
                                <Text>{daysLeft} {'\n'}</Text>
                                {daysLeft === 1 ? 'day' : 'days'} to go
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 16,
    },
});
