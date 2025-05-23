

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') { 
    next(); 
  } else {
    console.warn(`User ${req.user?.username} with role ${req.user?.role} attempted an admin action.`);
    res.status(403).json({ message: 'Forbidden: Yêu cầu quyền Admin.' }); 
  }
};

module.exports = { isAdmin };