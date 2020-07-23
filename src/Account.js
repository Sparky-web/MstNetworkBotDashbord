import React, {useEffect, useState} from "react"
import {Link, useParams, withRouter} from "react-router-dom";
import axios from "axios"
import {Button} from "reactstrap"

export default withRouter((props) => {
    let {id} = useParams();
    const [data, setData] = useState({
        login: undefined,
        password: undefined,
        data: [],
        lastTimeOpened: undefined
    });
    const [loading, setLoading] = useState(<div/>);
    useEffect(() => {
        axios.get("http://localhost:3001/getByLogin/" + id).then(e => {
            setData(e.data);
        }).catch(e => {
            console.error(e);
            alert("Smth happend")
        })
    }, []);

    const openCard = (event) => {
        setLoading(<div className="lds-dual-ring"/>);
      axios.get("http://localhost:3001/openCard/" + id)
          .then(e => {
              setData(e.data);
              setLoading(<div/>)
          })
          .catch(e => {
              console.error(e);
              alert("Smth happend");
              setLoading(<div/>)
          })
    };
    const getItem = (event) => {
        setLoading(<div className="lds-dual-ring"/>);
        axios.post("http://localhost:3001/getItem", data)
            .then(e => {
                setLoading(<div/>)
            })
            .catch(e => {
                console.error(e);
                alert("Smth happend");
                setLoading(<div/>)
            })
    };
    const handleDelete = (event) => {
        axios.get("http://localhost:3001/deleteAccount/" + id)
            .then(e => {
                console.log("ok")
            })
            .catch(e => {
                alert("error");
                console.error(e)
            });
        props.history.push("/")
    };
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(r => console.log("copied!"))
    }
    return (
        <div>
            <div className="container pt-5" style={{fontSize: 1.5 + "rem"}}>
                <p><b>Аккаунт:</b> {data.login}</p>
                <p><b>Последнее открытие карточек:</b> {data.lastTimeOpened}</p>
                <p><b>Выпавшие предметы: </b>
                    <ul>
                        {data.data.map(el => <li>{el}</li>)}
                    </ul>
                </p>
            </div>
            <div className="container pt-3">
                {loading}
                <Button color="primary" className="m-1" onClick={getItem}>Забрать все вещи!</Button>
                <Button color="secondary" className="m-1" onClick={openCard}>Открыть карточку</Button>
                <Button color="danger" className="m-1" onClick={handleDelete}>Удалить</Button>
                <Button color="primary" outline className="m-1" onClick={() => copyToClipboard(data.login + ":" + data.password)}>Скопировать</Button>
                <div className="w-100"/>
                <Link to="/"><Button color="danger" className="m-1">Назад</Button></Link>
            </div>
        </div>
    )
})