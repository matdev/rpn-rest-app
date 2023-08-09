import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect, useRef} from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import axios from 'axios'
import TextField from '@mui/material/TextField';

function App() {

    const [stacks, setStacks] = useState([]);
    const [selectedStack, setSelectedStack] = React.useState(0);

    const [updatedElements, setUpdatedElements] = React.useState();

    const inputRef = useRef();

    useEffect(() => {
        fetchStacks();
    }, []);

    function fetchStacks(){
        fetch('/rpn/list_stacks')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setStacks(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const handleChange = (event) => {
        console.log("handleChange() selectedStack : " + event.target.value);
        let selectedStack = event.target.value;
        setSelectedStack(selectedStack);

    };

    const handlePushValueButton = async (stack_id, val) => {

        let url = '/rpn/push_value?stack_id=' + stack_id + "&val=" + val;

        console.log("handlePushValueButton() url = " + url);

        const response = await axios.get(url)
        // TODO: Handle errors properly

        let elementsUpdated = getElements(response.data);

        console.log("handlePushValueButton() RESULT : " + elementsUpdated);

        setUpdatedElements(elementsUpdated)
    }

    const handleDeleteStackButton = async (stack_id) => {

        let url = '/rpn/delete_stack?stack_id=' + stack_id;

        console.log("handleDeleteStackButton() url = " + url);

        const response = await axios.get(url)

        console.log("handleDeleteStackButton() response : " + response);
        // TODO: Handle errors properly

        setUpdatedElements("");
    }

    const handleOperandButton = async (stack_id, op) => {

        let url = '/rpn/apply_op?stack_id=' + stack_id + "&op=" + op;

        console.log("handlePLUSButton() url = " + url);

        const response = await axios.get(url)
        // TODO: Handle errors properly

        let elementsUpdated = getElements(response.data);

        console.log("handlePLUSButton() RESULT : " + elementsUpdated);

        setUpdatedElements(elementsUpdated)
    }

    function getElements(selectedStack) {

        if (selectedStack.allElement === undefined) {
            return;
        }

        let result = "";

        selectedStack.allElement.map((x, i, row) => {

            console.log(" getElements : x = " + x);
            if (i + 1 === row.length){
                result = result + x;
            } else {
                result = result + x + " | ";
            }
        });

        return result;
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    Welcome to the RPN Calculator
                </h1>

                <div>
                    <div className={'select_stack'}>

                        <h3> Select stack id : </h3>

                        <Box className="MuiSelect-box" sx={{minWidth: 50}}>
                            <FormControl fullWidth>
                                <Select
                                    className="MuiSelect-select"
                                    labelId="currency-select-label"
                                    id="stack-select"
                                    value={selectedStack.id}
                                    onChange={handleChange}
                                >

                                    {Object.entries(stacks).map(([key, value]) => {

                                        console.log(" stack : " + key + " value : " + value.allElement);

                                        return (

                                            <MenuItem key={value.id} value={value}>{key}</MenuItem>

                                        );
                                    })}

                                </Select>
                            </FormControl>
                        </Box>
                    </div>
                    <p></p>
                    <p> Current stack id : {selectedStack.id} </p>
                    <p> Elements stacked: {getElements(selectedStack)}</p>

                    <br/>

                    <div>

                        <TextField key="input_val" className='input-field' id="input-spot" label="Enter push value"
                                   variant="filled"
                                   inputRef={inputRef}
                        />

                        <Button className={"operand_button"} variant="outlined"
                                onClick={() => {
                                    //alert('clicked');
                                    handlePushValueButton(selectedStack.id, inputRef.current.value);
                                }}
                        >
                            PUSH VALUE
                        </Button>
                    </div>
                    <p></p>
                    <Button className={"operand_button"} variant="outlined"
                            onClick={() => {
                                //alert('clicked');
                                handleOperandButton(selectedStack.id, "PLUS");
                            }}
                    >
                        +
                    </Button>

                    <Button className={"operand_button"} variant="outlined"
                            onClick={() => {
                                //alert('clicked');
                                handleOperandButton(selectedStack.id, "MINUS");
                            }}
                    >
                        -
                    </Button>

                    <Button className={"operand_button"} variant="outlined"
                            onClick={() => {
                                //alert('clicked');
                                handleOperandButton(selectedStack.id, "MULT");
                            }}
                    >
                        *
                    </Button>

                    <Button className={"operand_button"} variant="outlined"
                            onClick={() => {
                                //alert('clicked');
                                handleOperandButton(selectedStack.id, "DIV");
                            }}
                    >
                        /
                    </Button>

                    <p></p>
                    <h3> Updated stack : {updatedElements}</h3>

                    <br/>
                    <br/>
                    <Button className={"operand_button"} variant="outlined"
                            onClick={() => {
                                //alert('clicked');
                                handleDeleteStackButton(selectedStack.id);
                            }}
                    >
                        DELETE STACK
                    </Button>
                </div>


            </header>
        </div>
    );
}

export default App;

