// =====================================================
// firebase.js — Hub DAC / Raízes Vivas
// Configuração e funções de acesso ao Firestore
//
// Como usar:
// 1. Acesse https://console.firebase.google.com
// 2. Crie um projeto > Web app > copie o firebaseConfig
// 3. Cole no objeto firebaseConfig abaixo
// 4. No index.html, adicione antes do </body>:
//    <script type="module" src="firebase.js"></script>
// =====================================================

import { initializeApp }                         from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc,
         getDocs, query, where, orderBy }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInAnonymously }            from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ─── SUBSTITUA COM SEU CONFIG DO FIREBASE ─────────
const firebaseConfig = {
  apiKey:            "SUA_API_KEY",
  authDomain:        "seu-projeto.firebaseapp.com",
  projectId:         "seu-projeto-id",
  storageBucket:     "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdef123456"
};
// ───────────────────────────────────────────────────

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// Autenticação anônima (para gravar pedidos sem login obrigatório)
signInAnonymously(auth).catch(console.error);

// ─── PEDIDOS ──────────────────────────────────────
/**
 * Salva um pedido no Firestore (coleção "orders")
 * @param {object} order - dados do pedido
 * @returns {Promise<string>} - ID do documento criado
 */
export async function saveOrder(order) {
  try {
    const ref = await addDoc(collection(db, "orders"), {
      ...order,
      status:    "pending",
      createdAt: new Date(),
    });
    console.log("[Firebase] Pedido salvo:", ref.id);
    return ref.id;
  } catch (err) {
    console.error("[Firebase] Erro ao salvar pedido:", err);
    throw err;
  }
}

/**
 * Busca pedidos de um e-mail específico
 * @param {string} email
 * @returns {Promise<Array>}
 */
export async function getOrdersByEmail(email) {
  const q = query(
    collection(db, "orders"),
    where("email", "==", email),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── PRODUTOS (leitura do catálogo) ──────────────
/**
 * Busca todos os produtos publicados
 * @returns {Promise<Array>}
 */
export async function getProducts() {
  const q = query(
    collection(db, "products"),
    where("status", "==", "published")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Exporta db para uso direto se necessário
export { db, auth };
