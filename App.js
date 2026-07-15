import { StatusBar } from 'expo-status-bar';
import { StyleSheet, 
Text, 
View,
Modal,
TextInput,
FlatList, 
Touchable,
TouchableOpacity} from 'react-native';
import React, {  useState, useEffect } from 'react';
import { initDatabase } from './database/database';
import { addVente, getVente, getTotalGains} from './database/venteService';
import { addStockHistory, getTotalStockAdded, getTotalStockRemoved } from './database/stockService';

export default function App() {

  const [stock, setStock] = useState(0)
  const [ventes, setVentes] = useState([])
  const [totalGains, setTotalGains] = useState(0)

  //les Modals
  const [stockModalVisible, setStockModalVisible] = useState(false)
  const [ventesModalVisible, setVentesModalVisible] = useState(false)

  //le formulaire pour l'ajout de stock
  const [stockajout, setStockAjout] = useState("")
  //le formulaire pour l'ajout de la vente
  const [quantite, setQuantite] = useState("")
  const [prix, setPrix] = useState("")
  //charger les données aux démarrage
  useEffect(() =>{
    loadInitialData()
  },[])

  const loadInitialData = async () =>{
    try{
      await initDatabase()

      //charger les ventes
      const ventesData = await getVente()
      setVentes(ventesData)

      //charger les gains totaux
      const gains = await getTotalGains()
      setTotalGains(gains)

      //calculer le stock actuel
      const totalAdded = await getTotalStockAdded()
      const totalRemove = await getTotalStockRemoved()
      const currentStock = totalAdded - totalRemove
      setStock(currentStock)
    }catch(error){
      console.log("Error loading initial data:", error)
    }
  }




  //ajout de stock
  const ajouterStock = async () => {
    const quantiteStock = Number(stockajout)
    const nouveauStock = stock + quantiteStock
    setStock(nouveauStock)

    //enregistrer dans historique
    const date = new Date().toLocaleDateString()
    await addStockHistory(quantiteStock, 'ADD', date)

    setStockAjout("")
    setStockModalVisible(false)
  }

  //ajout de vente
  const ajouterVente = async() =>{
    const quantiteVente = Number(quantite)
    const prixVente = Number(prix)
    if(!quantiteVente || !prixVente){
      alert("Veuillez remplir tous les champs")
      return
    }
    const gainsVente = quantiteVente * prixVente
    const date = new Date().toLocaleDateString()
    if(quantiteVente > stock){
      alert("Stock insuffisant")
      return
    }

    //ajouter la vente
    await addVente(quantiteVente,prixVente, gainsVente, date)

    //enregistrement dans l'historique du stock
    await addStockHistory(quantiteVente,'REMOVE',date)

    //recharger les données
    const ventesData = await getVente()
    setVentes(ventesData)

    const gains = await getTotalGains()
    setTotalGains(gains)


    //reduire le stock
    setStock(stock - quantiteVente)

    setQuantite("")
    setPrix("")

    setVentesModalVisible(false)
  }

  return (
    <View style={styles.container}>
      {/*STOCK*/}
      <Text style={styles.title}>Stock de glace restant</Text>
      <Text style={styles.stock}>{stock} glaces</Text>

      {/*GAINS TOTAUX*/}
      <Text style={styles.subtitle}>Gains totaux</Text>
      <Text style={styles.stock}>{totalGains} FCFA</Text>

      {/*LISTE VENTES*/}
      <Text style={styles.subtitle}>Ventes récentes</Text>

      <FlatList
      data={ventes}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <Text style={{textAlign: "center", marginTop:"20"}}>
          Aucune vente
        </Text>
      }
      renderItem={({item}) => (
        <View style={styles.venteItem}>
          <Text>Quantité : {item.quantite}</Text>
          <Text>Prix unitaire: {item.prix} FCFA</Text>
          <Text>Gains: {item.gains} FCFA</Text>
          <Text>Date: {item.date}</Text>
        </View>
      )}/>

      {/*BOUTONS*/}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
        style={styles.button}
        onPress={() => setStockModalVisible(true)}>
          <Text style={styles.buttonText}>+ Ajouter Stock</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.button}
        onPress={() => setVentesModalVisible(true)}>
        <Text style={styles.buttonText}>+ Ajouter Ventes</Text>
        </TouchableOpacity>
      </View>

      {/*MODAL STOCK*/}
      <Modal
      visible={stockModalVisible}
      transparent
      animationType='slide'>
      <View style={styles.modalContainer}>
       <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Ajouter du stock</Text>
       <TextInput
       placeholder="Nombre de glaces"
       keyboardType="numeric"
       value={stockajout}
       onChangeText={setStockAjout}
       style={styles.input}></TextInput>

       <TouchableOpacity
       style={styles.saveButton}
       onPress={ajouterStock}>
        <Text style={styles.buttonText}>Enregistrer</Text>
       </TouchableOpacity>

       <TouchableOpacity
       onPress={() => setStockModalVisible(false)}>
        <Text style={styles.cancel}>Fermer</Text>
       </TouchableOpacity>
       </View>
      </View>
      </Modal>

      {/*MODAL VENTE*/}
      <Modal
      visible={ventesModalVisible}
      transparent
      animationType='slide'>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une vente</Text>

            <TextInput
            placeholder="Quantité"
            keyboardType="numeric"
            value={quantite}
            onChangeText={setQuantite}
            style={styles.input}></TextInput>
            <TextInput
            placeholder="Prix"
            keyboardType="numeric"
            value={prix}
            onChangeText={setPrix}
            style={styles.input}></TextInput>

            <TouchableOpacity
            style={styles.saveButton}
            onPress={ajouterVente}>
              <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => setVentesModalVisible(false)}>
              <Text style={styles.cancel}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#F5F5F5",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
  },

  stock: {
    fontSize: 40,
    color: "#0EA5E9",
    marginBottom: 30,
    marginTop: 10,
  },

  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  venteItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  buttonsContainer: {
    marginTop: 20,
    gap: 10,
  },

  button: {
    backgroundColor: "#0EA5E9",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  saveButton: {
    backgroundColor: "#10B981",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  cancel: {
    textAlign: "center",
    marginTop: 15,
    color: "red",
  },
});

