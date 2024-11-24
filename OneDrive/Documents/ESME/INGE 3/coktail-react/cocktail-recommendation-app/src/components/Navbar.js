import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <h1 style={styles.title}>MiX'Mate by ZipetteAI</h1>
      <Link to="/profile" style={styles.userIcon}>
        <FontAwesomeIcon icon={faUser} />
      </Link>
    </nav>
  );
};

const styles = {
  navbar: {
    padding: "1rem",
    backgroundColor: "#f4f4f4",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  userIcon: {
    textDecoration: "none",
    color: "black",
    fontSize: "1.5rem",
    marginRight: "1rem", // Décale l'icône vers la gauche
  },
};

export default Navbar;
