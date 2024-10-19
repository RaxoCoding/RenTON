import { supabase } from '../lib/supabaseClient';
import { Product } from '../types/product'; // Assurez-vous d'importer le type Product depuis un fichier de type
import { FullProduct } from "@/types/product";


// Function to fetch products
export async function getProducts(): Promise<Product[] | null> {
    const query = supabase.from('products').select('*');

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return null;
    }

    return data as Product[];
  }

// Fonction pour récupérer un produit par son UUID
export async function getProductById(productId: string): Promise<FullProduct | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single(); // Utilise .single() pour s'assurer qu'un seul produit est retourné

    if (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      return null;
    }

    const { data: ownerData, error: ownerError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data?.owner)
        .single();

    if (ownerError) {
        console.error('Erreur lors de la récupération du propriétaire:', ownerError);
        return null;
    }

    return {
        ...data,
        owner: ownerData,
    } as FullProduct;
}
