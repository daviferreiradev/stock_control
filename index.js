const express = require("express")
const exphbs = require("express-handlebars")
const pool = require("./db/conn")

const app = express()
const port = 3000

app.use(
    express.urlencoded({
        extended: true
    })
)

app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")

// Routes
app.get("/", (req, res) => {
    res.render("../views/home")
})

app.get("/products", (req, res) => {
    const query = `SELECT * FROM product`
    pool.query(query, (err, data) => {
        if(err) 
            console.log(err)
        
        const products = data

        res.render("../views/products", { products })
    })
})

app.get("/product/:id", (req, res) => {
    const id = req.params.id

    const query = `SELECT * FROM product WHERE id = ${id}`

    pool.query(query, (err, data) => {
        if(err) {
            console.log(err)
        }

        const product = data[0]

        res.render("../views/product", { product })
    })
})

app.get("/products/edit/:id", (req, res) => {
    const id = req.params.id

    const query = `SELECT * FROM product WHERE id = ${id}`

    pool.query(query, (err, data) => {
        if(err) {
            console.log(err)
        }

        const product = data[0]

        res.render("../views/edit", { product })
    })
})

app.post("/product", (req, res) => {
    const title = req.body.title
    const price = req.body.price
    
    const query = `INSERT INTO product (??, ??) VALUES (?, ?)`
    const data = ["title", "price", title, price]

    pool.query(query, data, (err) => {
        if(err)
            console.log(err)
        else
            res.redirect("/products")
    })
})

app.post("/products/update", (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const price = req.body.price

    const query = `UPDATE product SET title = "${title}", price = "${price}" WHERE id = ${id}`

    pool.query(query, (err) => {
        if(err)
            console.log(err)
        else
            res.redirect("/products")
    })
})

app.post("/products/delete/:id", (req, res) => {
    const id = req.params.id

    const query = `DELETE FROM product WHERE id = ${id}`

    pool.query(query, (err) => {
        if(err)
            console.log(err)
        else
            res.redirect("/products")
    })
})

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`)
})