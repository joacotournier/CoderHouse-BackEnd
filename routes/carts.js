import express from "express";
const router = express.Router();
import CartManager from "../managers/CartManager";
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(Number(req.params.cid));
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ error: 'Cart not found' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const updatedCart = await cartManager.addProductToCart(Number(req.params.cid), Number(req.params.pid));
    if (updatedCart) {
        res.json(updatedCart);
    } else {
        res.status(404).json({ error: 'Cart or Product not found' });
    }
});

module.exports = router;
