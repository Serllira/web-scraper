import React, {useEffect, useState} from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import defaultImage from './imageDefault.png';
import useDebounce from "./useDebounce";


export default function Resultados() {

    const columns = [
        {id: '_id', label: 'ID', minWidth: 40, maxWidth: 40, align: 'center', format: 'id'},
        {id: 'nombre', label: 'Nombre', minWidth: 100, maxWidth: 100, align: 'center'},
        {
            id: 'precio',
            label: 'Precio',
            minWidth: 40,
            maxWidth: 40,
            align: 'center',
        },
        {
            id: 'descripcion',
            label: 'Descripción',
            minWidth: 170,
            maxWidth: 170,
            align: 'center',
        },
        {
            id: 'imagen',
            label: 'Imagen',
            minWidth: 170,
            maxWidth: 170,
            align: 'center',
            format: 'img',
        },
        {
            id: '_id',
            label: 'Ver detalles',
            minWidth: 40,
            maxWidth: 40,
            align: 'center',
            format: 'link',
        },
    ];
    const [filteredData, setFilteredData] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearchTerm = useDebounce(inputValue, 500);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    async function getData() {
        const response = await axios.get('/api/services')
        return response.data;
    }

    function createData(_id, nombre, precio, descripcion, imagen) {
        return {_id, nombre, precio, descripcion, imagen};
    }

    async function iterateData() {
        let asd = await getData();
        console.log('asd', asd)
        const array = [];
        for (let i = 0; i < asd.data.length; i++) {
            let id = asd.data[i]._id;
            let nombre = asd.data[i].nombre;
            let precio = asd.data[i].precio;
            let descripcion = asd.data[i].descripcion;
            let imagen = asd.data[i].imagen;
            array.push(createData(id, nombre, precio, descripcion, imagen));
        }
        return array
    }

    async function searchName(text) {
        return await axios.get('/api/services/search?nombre=' + text);
    }

    useEffect(() => {
        async function fetchData() {
            const result = await iterateData();
            setRows(result);
        }

        fetchData();
    }, [rowsPerPage]);

    useEffect(
        () => {
            if (debouncedSearchTerm) {
                setIsSearching(true);
                searchName(debouncedSearchTerm).then(results => {
                    setIsSearching(false);
                    console.log('resukt', results)
                    results ?
                        setFilteredData(results.data.data) : setFilteredData([]);
                });
            } else {
                setFilteredData(rows);
            }
        },
        [debouncedSearchTerm]
    );

    if (rows === null) {
        return <CircularProgress/>
    }

    console.log('ROWS', rows)
    console.log('filtereddata', filteredData)
    return (
        <div className="pageContainer">
            <div className="search-bar">
                <form className="" onSubmit={event => {
                    event.preventDefault()
                }}>
                    <TextField id="outlined-basic" label="Busca un nombre..." variant="outlined" value={inputValue}
                               onChange={e => setInputValue(e.target.value)} className="search-input"
                    />
                    {isSearching && <CircularProgress className="search-input-loading"/>}
                </form>
            </div>
            <div className="data-container">
                <Paper className="">
                    <div className="">
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map(column => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{minWidth: column.minWidth, maxWidth: column.maxWidth}}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(filteredData && filteredData.length >= 0) ?
                                    filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                        return (
                                            <TableRow hover role="checkbox" key={index}>
                                                {columns.map(column => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id}
                                                                   align={column.align}
                                                                   className="table-cell">
                                                            {column.format === 'img' ?
                                                                <img src={value || defaultImage}
                                                                     className="table-img-cell"
                                                                     alt="Imagen del producto" onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = defaultImage
                                                                }}/> :
                                                                column.format === 'link' ?
                                                                    <Button href={`/VerDetalles?id=${value}`}
                                                                            variant="contained" color="#2B7A78"
                                                                    >
                                                                        Ver detalles
                                                                    </Button>
                                                                    : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    }) : rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                        return (
                                            <TableRow hover role="checkbox"
                                                      key={index}>
                                                {columns.map(column => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}
                                                                   className="table-cell">
                                                            {column.format === 'img' ?
                                                                <img src={value || defaultImage}
                                                                     className="table-img-cell"
                                                                     alt="Imagen del producto" onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = defaultImage;
                                                                }}/> :
                                                                column.format === 'link' ?
                                                                    <div>
                                                                        <Button href={`/VerDetalles?id=${value}`}
                                                                                variant="contained" color="#2B7A78"
                                                                        >
                                                                            Ver detalles
                                                                        </Button>
                                                                    </div>

                                                                    : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={(filteredData && filteredData.length >= 0) ? filteredData.length : rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        </div>
    );
}