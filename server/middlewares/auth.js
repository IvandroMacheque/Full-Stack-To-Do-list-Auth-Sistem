import jwt from "jsonwebtoken"

const secretKey = process.env.JWT_SECRET

const auth = (req, res, next) => {
    const token = req.headers.authorization
    if(!token){
        return res.status(401).json({ message: "Acesso negado" })
    }
    try {
        const decodedToken = jwt.verify(token.replace("Bearer ", ""), secretKey)
        req.userId = decodedToken.id
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Token inválido" })
    }
}
export default auth
