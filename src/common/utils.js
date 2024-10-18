const handlerWrapper = (handler) => async (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

async function sleeper(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

module.exports = { sleeper, handlerWrapper };
