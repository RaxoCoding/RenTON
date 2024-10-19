import { supabase } from '../../lib/supabaseClient';

async function checkWalletAddressExists(walletAddress : string) {
  // Exécute une requête SELECT pour vérifier si l'adresse existe déjà
  const { data, error } = await supabase
    .from('User')              // Nom de la table
    .select('walletAddress')    // Colonne à vérifier
    .eq('walletAddress', walletAddress); // Condition

  // Si une erreur survient pendant la requête, tu peux la gérer ici
  if (error) {
    console.error('Error checking wallet address:', error);
    return { exists: false, error };
  }

  // Vérifie si des données ont été retournées
  if (data.length > 0) {
    return { exists: true };
  } else {
    return { exists: false };
  }
}

export default checkWalletAddressExists;
