import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import Auth from '../../pkg/auth';
import AddFactorForm from '../AddFactorForm/AddFactorForm';
import '../../App.css';

const FactorsList = ({rerender}) => {
    const [factors, setFactors] = useState([]);
    const [selectedFactor, setSelectedFactor] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const fetchFactors = () => {
        Auth.axiosInstance.get('/api/v1/homepage/factors/')
            .then(response => {
                setFactors(response.data.factors);
            })
            .catch(error => {
                console.error(error);
            })
    };

    useEffect(() => {
        fetchFactors();
    }, [isAddDialogOpen, isEditDialogOpen]);

    const openEditDialog = (factor) => {
        setSelectedFactor(factor);
        setIsEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setSelectedFactor(null);
        setIsEditDialogOpen(false);
        rerender();
        //fetchFactors();
    };

    const openAddDialog = () => {
        setIsAddDialogOpen(true);
    };

    const closeAddDialog = () => {
        setIsAddDialogOpen(false);
        rerender();
        //fetchFactors();
    };

    return (
        <div>
            <div className="header">
                <h1 className="list-title">Факторы</h1>
                <button className="button-light-blue button-gap" style={{marginLeft: "10px"}} onClick={openAddDialog}>Добавить фактор</button>
            </div>
            <div className="event-container" style={{height: '100%', overflowY: 'auto', boxSizing: 'border-box'}}>
                {factors.filter(factor => factor.visible).map((factor, index) => {
                    return (
                        <div key={factor.id} className="event-card" onClick={() => openEditDialog(factor)}
                             style={{boxSizing: 'border-box'}}>
                            <h2 className="card-event-name">{factor.name}</h2>
                        </div>
                    )
                })}
            </div>
            <Modal isOpen={isEditDialogOpen} onRequestClose={closeEditDialog} style={{
                content: {
                    width: '35%', height: '75%', margin: 'auto',
                }
            }}>
                <AddFactorForm factor={selectedFactor} onClose={closeEditDialog} onDelete={fetchFactors} />
            </Modal>
            <Modal isOpen={isAddDialogOpen} onRequestClose={closeAddDialog} style={{
                content: {
                    width: '35%', height: '75%', margin: 'auto',
                }
            }}>
                <AddFactorForm onClose={closeAddDialog}/>
            </Modal>
        </div>
    )
};

export default FactorsList;