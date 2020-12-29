import React, { useState } from 'react';
import auth from '../auth/auth-helper';
import { remove } from './api-user';
import { Redirect } from 'react-router-dom';
import { 
  Button, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  IconButton,
  Dialog } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const DeleteUser = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const clickButton = () => {
    setOpen(true);
  }
  const handleRequestClose = () => {
    setOpen(false);
  }
  const deleteAccount = async () => {
    try {
      const jwt = auth.isAuthenticated();
      const response = await remove({ userId }, { t: jwt.token });
      console.log(response);
      if(response.error) {
        console.log(response.error)
      } else {
        auth.clearJWT(() => console.log('Borrado'));
        setRedirect(true);
      }
    } catch (error) {
      console.log(error.response);
    }
  }
  if(redirect) {
    <Redirect to="/" />
  }
  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>Cuenta borrada</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Cuenta borrada exitosamente
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteAccount} color="secondary" autoFocus="autoFocus">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}
 
export default DeleteUser;