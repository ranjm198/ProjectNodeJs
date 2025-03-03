import jwt from 'jsonwebtoken';

export function authenticateJWT(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Assurez-vous de récupérer le token du header

  if (!token) {
    return res.status(403).json({ message: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }

    req.user = user; // Ajoutez l'utilisateur à la requête
    next();
  });
}
