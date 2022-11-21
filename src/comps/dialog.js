//imports for the project
import React, { useState, useEffect } from 'react';

// import materials from outside
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// import components from outside
import DateTime from './dateTime';
import { TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import toastr from 'toastr';

// Export the code into master 
export default function ResponsiveDialog(props) {

    // variable declaration
    const [type] = useState(props.type) 
    
    let [rows] = useState(props.rowFromParent)

    // const variable
    const [deadline, setDeadLine] = useState(isEmpty(rows) || props.index === -1 ? null : rows[props.index].deadline);
    const [description, setDescription] = useState(isEmpty(rows) || props.index === -1 ? null : rows[props.index].description)
    const [priority, setPriority] = useState(isEmpty(rows) || props.index === -1 ? null : rows[props.index].priority)
    const [checked, setChecked] = useState(isEmpty(rows) || props.index === -1 ? null : rows[props.index].checked)
    const [title, setTitle] = useState(isEmpty(rows) || props.index === -1 ? null : rows[props.index].title)


    function isEmpty(obj) {
        return !obj || obj.length === 0 || Object.keys(obj).length === 0;
    }

    // the cancel function
    let cancel = () => {
        props.parentCallback({
            action: 'cancel',
            data: {}
        });
    };

    let submitAdd = () => {
        if (title !== "" && title !== null && !checkDups(title) && description !== "" && description !== null && priority !== "" && deadline) {
            props.parentCallback({
                action: 'submit',
                data: { title: title, description: description, deadline: deadline, priority: priority, checked: checked, setChecked: setChecked }
            });
        }

        if(title === "" || title === null){
            toastr.error('Title must not be empty!', ``, { 'closeButton': true, positionClass: 'toast-bottom-right' });
        }

        if(description === "" || description === null){
            toastr.error('Description must not be empty!', ``, { 'closeButton': true, positionClass: 'toast-bottom-right' });
        }

    };

    // the edit of the submit
    let submitEdit = () => {
        if (description !== ""  && description !== null && priority !== "" && deadline) {
            props.parentCallback({
                action: 'edit',
                data: { title: title, description: description, deadline: deadline, priority: priority, checked: checked, setChecked: setChecked },
                index: props.index
            });
        }

        if(description === "" || description === null){
            toastr.error('Description must not be empty!', ``, { 'closeButton': true, positionClass: 'toast-bottom-right' });
        }
    };

    // checking duplicate for the function
    let checkDups = (text) => {
        let dup = false
        for(let i = 0; i < rows.length; i++) {
            if(rows[i].title === text) {
                return true
            }
        }
        
        return dup
    }

    // display title helper text
    let displayTitleHelperText = (title) => {
        if(title === "") {
            return "Title is Required!"
        }
        else if(checkDups(title)) {
            return "Title already Existed!"
        }
        else {
            return ""
        }
    }

    //return the master branch of project
    return (
        <>
            {/*the title*/}
            {type === "add" ? <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
                <i className="fa fa-fw fa-plus-circle"></i>Add Task
            </DialogTitle> : <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
                <i className="fa fa-fw fa-edit-circle"></i>Edit Task
            </DialogTitle>}
            {/*the content*/}
            <DialogContent>
                <br /><br />
                {type === "add" ? 
                <TextField
                    error={type === "add" ? (title === "" || checkDups(title)) : false}
                    id="title"
                    label="Title"
                    helperText={displayTitleHelperText(title)}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                /> : null}

                <br /><br /><br />

                <TextField
                    error={type === "add" ? description === "" : false}
                    id="description"
                    label="Description"
                    helperText="Description is Required!"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/*the deadline*/}
                <br /><br /><br />
                <DateTime dataFromParent={deadline} dataToParent={setDeadLine} />

                <br /><br /><br />

                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Priority</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="priority"
                        name="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <FormControlLabel value="low" control={<Radio />} label="Low" />
                        <FormControlLabel value="med" control={<Radio />} label="Med" />
                        <FormControlLabel value="high" control={<Radio />} label="High" />
                    </RadioGroup>
                </FormControl>

            </DialogContent>
            {/*action buttons*/}
            <DialogActions sx={{ bgcolor: 'white' }}>
                {/*cancel button*/}
                {type === 'add' ? <Button onClick={submitAdd} variant="contained" sx={{ width: 100, marginRight: '7px' }}>
                    <i className="fa fa-fw fa-plus-circle"></i>Add
                </Button> : <Button onClick={submitEdit} variant="contained" sx={{ width: 100, marginRight: '7px' }}>
                    <i className="fa fa-fw fa-edit-circle"></i>Edit
                </Button>}

                <Button onClick={cancel} variant="contained" color='error' sx={{ bgcolor: '#f44336', width: 100 }}>
                    <i className="fa fa-fw fa-ban"></i>&nbsp;Cancel
                </Button>
            </DialogActions>
        </>
    );
}