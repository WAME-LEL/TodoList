import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import * as Font from 'expo-font';
import * as SQLite from 'expo-sqlite';

const Input = () => {


    const [textValue, setTextValue] = useState([]);
    const [todoList, SetTodoList] = useState([]);
    const [confirmCheck, SetConfirmCheck] = useState([]);
    const [selectedFont, setSelectedFont] = useState('Roboto');
    const [priority, setPriority] = useState([1]);


    const db = SQLite.openDatabase('database.db');

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS list (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL, confirm INTEGER NOT NULL, priority INTEGER NOT NULL)',
                [],
                (_, result) => {
                    // 쿼리 실행 결과 처리
                    console.log('테이블 생성 완료');
                },
                (_, error) => {
                    // 쿼리 실행 오류 처리
                    console.error('테이블 생성 오류:', error);
                }
            );
        });

    }, [])


    const onAddTextInput = () => {
        SetTodoList([...todoList, ""])
        SetConfirmCheck([...confirmCheck, true])
        setTextValue([...textValue, ""])
        setPriority([...priority, priority.length + 1])
        console.log(todoList.length)
    }

    const onDeleteList = (position) => {
        const newTodoList = todoList.filter((num, idx) => {
            return position != idx
        })
        const newConfirmCheck = confirmCheck.filter((num, idx) => {
            return position != idx
        })
        const newTextValue = textValue.filter((num, idx) => {
            return position != idx
        })
        SetTodoList(newTodoList);
        SetConfirmCheck(newConfirmCheck);
        setTextValue(newTextValue);

    }

    const confirm = (position) => {
        const confirmList = [...confirmCheck];
        confirmList[position] = false;
        SetConfirmCheck(confirmList)
    }

    const edit = (position) => {
        const confirmList = [...confirmCheck];
        confirmList[position] = true;
        SetConfirmCheck(confirmList)
    }


    const fixCheck = (position) => {
        if (confirmCheck[position]) {
            return "editable"
        }
        else {
            return "not editable"
        }
    }

    const textInputChangeValue = (text, idx) => {
        const newValues = [...textValue];
        newValues[idx] = text;
        setTextValue(newValues);
    }


    const sortArrayAscending = () => {
        const sortedArray = priority.slice().sort((a, b) => a - b);
        setPriority(sortedArray);
    };

    const increasePriority = (idx) => {
        if (priority[idx] != 1) {
            let newPriority = [...priority]

            let temp = newPriority[idx]
            newPriority[idx] = newPriority[idx - 1]
            newPriority[idx - 1] = temp
            console.log('priority' + priority[idx] + 'idx' + idx)
            console.log('priority' + priority)
            console.log('new priority' + newPriority)
            setPriority([...newPriority])
            console.log('priority' + priority[idx] + 'idx' + idx)
            console.log('priority' + priority)
            console.log('new priority' + newPriority)

        }
    }

    useEffect(() => {
        readData();
    }, []);

    const decreasePriority = (idx) => {
        if (priority[idx] != priority[priority.length - 1]) {
            let newPriority = [...priority]

            let temp = newPriority[idx]
            newPriority[idx] = newPriority[idx + 1]
            newPriority[idx + 1] = temp
            console.log(newPriority)
            console.log('priority' + priority[idx] + 'idx' + idx)
            console.log('priority' + priority)
            console.log('new priority' + newPriority)

            setPriority([...newPriority])
            console.log('priority' + priority[idx] + 'idx' + idx)
            console.log('priority' + priority)
            console.log('new priority' + newPriority)
        }

    }


    const saveData = () => {

        db.transaction(tx => {
            if (priority.length > 1) {
                tx.executeSql(
                    'DELETE FROM list',
                    [],
                    (_, result) => {
                        console.log('데이터 삭제 완료');
                    },
                    (_, error) => {
                        console.error('데이터 삭제 오류:', error);
                    }
                );

            }


            todoList.map((item, idx) => {
                tx.executeSql(
                    'INSERT INTO list (content, confirm, priority) VALUES (?, ?, ?)',
                    [textValue[idx], confirmCheck[idx], priority[idx]],
                    (_, result) => {
                        console.log('데이터 삽입 완료');
                    },
                    (_, error) => {
                        console.error('데이터 삽입 오류:', error);
                    }
                );
            })
        });
    }

    const readData = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM list ORDER BY priority',
                [],
                (_, result) => {
                    const rows = result.rows;
                    const tempID = [];
                    const tempContent = [];
                    const tempConfirm = [];
                    const tempPriority = [];



                    for (let i = 0; i < rows.length; i++) {
                        const item = rows.item(i);

                        tempID.push(item.id);
                        tempContent.push(item.content);
                        tempConfirm.push(item.confirm);
                        tempPriority.push(item.priority);
                    }


                    SetTodoList([...tempID])
                    SetConfirmCheck([...tempConfirm])
                    setTextValue([...tempContent])
                    setPriority([...tempPriority])

                    console.log(rows);

                },
                (_, error) => {
                    console.error('데이터 조회 오류:', error);
                }

            );


        });

        console.log(todoList);
        console.log(confirmCheck);
        console.log(textValue);
        console.log(priority);
    }

    useEffect(() => {
        saveData()
    }, [priority]);


    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'BlackHanSans-Regular': require('../assets/fonts/BlackHanSans-Regular.ttf'),
                'Gugi-Regular': require('../assets/fonts/Gugi-Regular.ttf'),
                'Jua-Regular': require('../assets/fonts/Jua-Regular.ttf'),
                'NanumPenScript-Regular': require('../assets/fonts/NanumPenScript-Regular.ttf'),
                'Stylish-Regular': require('../assets/fonts/Stylish-Regular.ttf'),
            });
        };

        loadFonts();
    }, []);

    useEffect(() => {
        saveData();
      }, [todoList, confirmCheck, textValue, priority]);




    return (
        <View>
            <Picker
                selectedValue={selectedFont}
                onValueChange={(item) => setSelectedFont(item)}
            >
                <Picker.Item label="Roboto" value="Roboto" />
                <Picker.Item label="BlackHanSans-Regular" value="BlackHanSans-Regular" />
                <Picker.Item label="Gugi-Regular" value="Gugi-Regular" />
                <Picker.Item label="Jua-Regular" value="Jua-Regular" />
                <Picker.Item label="NanumPenScript-Regular" value='NanumPenScript-Regular' />
                <Picker.Item label="Stylish-Regular" value='Stylish-Regular' />


            </Picker>

            <TouchableOpacity
                style={styles.addButton}
                onPress={readData}
            >
                <Text style={{ color: "white" }}>
                    새로고침
                </Text>

            </TouchableOpacity>

            <TouchableOpacity
                style={styles.addButton}
                onPress={onAddTextInput}
            >
                <Text style={{ color: "white" }}>ADD TODO LIST</Text>


            </TouchableOpacity>




            <ScrollView>
                {
                    todoList.map((item, idx) => {

                        return (
                            <View key={idx}>
                                {/* <Text>{todoList[idx]}</Text>
                                <Text>{todoList.length}</Text> */}
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Text style={styles.pritorityText}>{priority[idx]}</Text>

                                    <TouchableOpacity
                                        style={styles.priorityButton}
                                        onPress={() => {
                                            increasePriority(idx)
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontSize: '15px' }}>increase</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.priorityButton}
                                        onPress={() => decreasePriority(idx)}
                                    >
                                        <Text style={{ color: 'white' }}>decrease</Text>
                                    </TouchableOpacity>

                                </View>


                                <TextInput
                                    style={{ ...styles.list, fontFamily: selectedFont }}
                                    onChangeText={(text) => textInputChangeValue(text, idx)}
                                    placeholder='Enter the text...'
                                    value={textValue[idx]}
                                    multiline={true}
                                    editable={confirmCheck[idx]}
                                />



                                <View style={styles.buttonContainer}>


                                    <TouchableOpacity
                                        style={styles.confirmButton}
                                        onPress={() => confirm(idx)}
                                    >
                                        <Text style={styles.buttonText}>
                                            confirm
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => edit(idx)}
                                    >
                                        <Text style={styles.buttonText}>
                                            edit
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => {
                                            onDeleteList(idx)

                                        }}
                                        title='delete'
                                    >

                                        <Text
                                            style={styles.buttonText}>delete</Text>

                                    </TouchableOpacity>

                                    <Text>{fixCheck(idx)}</Text>
                                </View>


                            </View>


                        )
                    })
                }
            </ScrollView>

        </View>

    );

}

const styles = StyleSheet.create({
    pritorityText: {
        fontSize: '15px',
        marginRight: 15,

    },
    priorityButton: {
        backgroundColor: "#975C8D",
        width: 60,
        color: "white",
        marginRight: 5,
        textAlign: 'center'
    },

    addButton: {
        marginBottom: 20,
        height: 50,
        borderColor: "black",
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2A2F4F'
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: "black",
        marginBottom: 15

    },

    confirmButton: {
        backgroundColor: "#975C8D",
        width: 110,
    },


    editButton: {
        backgroundColor: "#D989B5",
        width: 110,
    },


    deleteButton: {
        backgroundColor: "#FFADBC",
        width: 110,
    },

    buttonText: {
        color: "white",
        fontSize: 25,
        textAlign: 'center'
    },

    list: {
        fontSize: 30,
        borderWidth: 1,
        borderColor: "black",
        color: "black"
    }
})


export default Input;