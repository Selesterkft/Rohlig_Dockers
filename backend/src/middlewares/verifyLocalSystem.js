export function verifyLocalSystem(req, res, next) {
  try {
    if (process.env.LOCAL_SYSTEM_IP && process.env.LOCAL_SYSTEM_IP !== '*') {
      if (process.env.LOCAL_SYSTEM_IP !== req.ip)
        throw new Error('Forbidden');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
}
