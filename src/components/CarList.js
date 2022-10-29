import React, { useState, useEffect } from 'react';
import { AgGridReact } from'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import AddCar from './AddCar';
import EditCar from './EditCar';

export default function CarList() {

    const deleteCellRenderer = props => <Button color="error" size="small" onClick={() => deleteCar(props.value)}>Delete</Button>;
    const editCellRenderer = props =>  <EditCar updateCar={updateCar} car={cars[props.value]}/>  

    const [cars, setCars] = useState([]);
    const [open, setOpen] = React.useState(false);

    useEffect(() => fetchCars(), []);

    const fetchCars = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.log(err));
    };

    const deleteCar = (link) => {
        if (window.confirm("The car will be deleted! Are you sure?")) {
            fetch(link, {method: 'DELETE'})
            .then(response => {
                setOpen(true);
                fetchCars();
            })
            .catch(err => console.log(err));
        }
    };

    const saveCar = (car) => {
        fetch('https://carstockrest.herokuapp.com/cars', 
        {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(car)})
        .then(response => fetchCars())
        .catch(err => console.log(err));
    };

    const updateCar = (car, link) => {
        fetch(link, 
        {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(car)})
        .then(response => fetchCars())
        .catch(err => console.log(err));
    };     

    const columns = [
        { field: "brand", sortable: true, filter: true, cellStyle: {textAlign: "left"}},
        { field: "model", sortable: true, filter: true, cellStyle: {textAlign: "left"} },
        { field: "color", sortable: true, filter: true, cellStyle: {textAlign: "left"}, maxWidth: 150 },
        { field: "fuel", sortable: true, filter: true, cellStyle: {textAlign: "left"}, maxWidth: 100 },
        { field: "year", sortable: true, filter: true, cellStyle: {textAlign: "left"}, maxWidth: 100 },
        { field: "price", sortable: true, filter: true, cellStyle: {textAlign: "left"}, maxWidth: 100 },
        { valueGetter: 'node.id', headerName: "", width: 100, cellStyle: {textAlign: "left"},
            cellRenderer: editCellRenderer},       
        { field: "_links.self.href", headerName: "", width: 100, cellStyle: {textAlign: "left"},
            cellRenderer: deleteCellRenderer}           
    ];

    return (
        <div className="ag-theme-material" style={{height: '900px', width: '100%', margin: 'auto'}} >
            <AddCar saveCar={saveCar} />
            <AgGridReact
                columnDefs={columns} 
                rowData={cars}>
            </AgGridReact>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={(event, reason) => {setOpen(false)}}
                message="The car was deleted"
                severity="success"
                />
        </div>
    );
};