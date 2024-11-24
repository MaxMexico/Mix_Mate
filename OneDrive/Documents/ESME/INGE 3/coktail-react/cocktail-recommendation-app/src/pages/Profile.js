import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

const Profile = () => {
  const navigate = useNavigate();

  const favoriteCocktails = [
    "Mojito",
    "Pina Colada",
    "Bloody Mary",
    "Cosmopolitan",
    "Whiskey Sour",
  ];

  const favoriteFlavors = ["Fruité", "Sucré", "Amer", "Épicé"];

  return (
    <div style={styles.container}>
      {/* Bouton Retour */}
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        style={styles.backButton}
      >
        Retour
      </Button>

      {/* Photo et pseudo */}
      <div style={styles.profileHeader}>
        <img
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhX-qGFDII3R0HbsVYXl8edNEJTS2TLV6nDKchg2iwjU7IOtYa4X7rELlvPFOYgI1GYK1mVv0f0EoGIJk2lBLI15Rbcnc-WLNzNLUyht130ZYQMHJ7ptNnaHriziTWTGws33z37tmXeFPY/s602/Koala-Pictures.jpg"
          alt="Profil"
          style={styles.profileImage}
        />
        <h2 style={styles.pseudo}>CocktailLover123</h2>
      </div>

      {/* Liste des cocktails préférés */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Cocktails Préférés</h3>
        <List style={styles.list}>
          {favoriteCocktails.map((cocktail, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={cocktail} />
              </ListItem>
              {index < favoriteCocktails.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </div>

      {/* Liste des goûts préférés */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Goûts Préférés</h3>
        <List style={styles.list}>
          {favoriteFlavors.map((flavor, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={flavor} />
              </ListItem>
              {index < favoriteFlavors.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </div>
    </div>
  );
};

// Styles en ligne
const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  backButton: {
    marginBottom: "1rem",
    backgroundColor: "#007bff", // Couleur principale du bouton
    color: "#fff",
    alignSelf: "flex-start",
  },
  profileHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    border: "3px solid #007bff",
    marginBottom: "1rem",
    objectFit: "cover", // Assure que l'image remplit le cadre sans déformation
  },
  pseudo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  section: {
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: "0.5rem",
  },
  list: {
    backgroundColor: "#fff",
    borderRadius: "5px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
};

export default Profile;
