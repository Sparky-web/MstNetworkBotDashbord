import React, {useEffect, useState} from "react";
import axios from "axios"
import {Table, Form, Input, Label, Button, ButtonGroup} from "reactstrap"
import {Link, withRouter} from "react-router-dom";

export default withRouter((props) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(<div/>);
    const getData = () => {
        axios.get("http://localhost:3001/getData")
            .then(e => {
                setData(e.data.map((el, i) => {
                    const additional = el.data.length > 2 ? ` и еще ${el.data.length - 2} предмета...` : "";
                    console.log(additional);
                    return (<tr key={i}>
                        <th scope="row" className="p-3">
                            <Link to={"/" + el.login}>
                                {el.login}
                            </Link>
                        </th>
                        <td>{el.data.slice(0, 2).toString() + additional}</td>
                        <td>{el.lastTimeOpened}</td>
                    </tr>)
                }))
            }).catch(e => {
            console.error(e);
            alert("Smth happend")
        });
    };
    useEffect(() => {
        getData()
    }, []);

    const handleSubmit = event => {
        event.preventDefault();

        const data = {
            login: event.target.data.value.split(":")[0],
            password: event.target.data.value.split(":")[1],
            token: event.target.token.value,
            data: [],
            lastTimeOpened: 0
        };
        axios.post("http://localhost:3001/addAccount", data)
            .then(e => {
                    getData();
                    alert(e.data)
                }
            )
            .catch(e => {
                    console.error(e);
                    alert("Error OOPS");
                }
            )
    };
    const handleOpenCards = event => {
        setLoading(<div className="lds-dual-ring"/>);
        axios.get("http://localhost:3001/openCards").then(e =>{
            setLoading(<div/>);
            alert("Opened");
            props.history.push("/")
        }).catch(e => {
            setLoading(<div/>);
            console.error(e);
            alert("Error, watch console")
        })
    };
    const handleCheck = event => {
        setLoading(<div className="lds-dual-ring"/>);
        axios.get("http://localhost:3001/checkAccounts").then(e => {
            setLoading(<div/>);
            alert(e.data.map(e => `${e.login}`).toString() + " - невалид")
        }).catch(e => {
            console.error(e);
            alert("error")
        })
    };
    const handleGetItems = event => {
        setLoading(<div className="lds-dual-ring"/>);
        axios.get("http://localhost:3001/getItems")
            .then(e => {
                alert("OK");
                setLoading(<div />);
                props.history.push("/")
            })
            .catch(e => {
                console.error(e);
                alert("error");
                setLoading(<div />);
            })
    };

    return (
        <div className="container p-3">
            <Table className="" hover striped bordered>
                <thead>
                <tr>
                    <th>Аккаунт</th>
                    <th>Предметы</th>
                    <th>Последнее открытие</th>
                </tr>
                </thead>
                <tbody>
                {data}
                </tbody>
            </Table>
            {loading}
            <div className="mt-3">
                    <Button color="primary" outline onClick={handleOpenCards}>Открыть все</Button>
                    <Button color="info" outline className="ml-2" onClick={handleGetItems}>Забрать всё</Button>
                    <Button color="success" outline className="ml-2" onClick={handleCheck}>Проверить все аккаунты</Button>
            </div>
            <div className="pt-3">
                <Form onSubmit={handleSubmit} className="add-account">
                    <Label>Введите логин:пароль вк</Label>
                    <Input name="data"/>
                    <Label className="mt-3">Введите токен</Label>
                    <Input name="token"/>
                    <Button className="mt-3" color="success">Добавить</Button>
                </Form>
            </div>
        </div>
    )
})