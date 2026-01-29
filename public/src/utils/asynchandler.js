const asynchandler = (requesthandler) => {
    return (req,res, next) => {
        Promise.resolve(requesthandler(req,res,next))
        .catch((err) => next(err))
    }
}

export {asynchandler}



//  const asynkhandler = () => {}
//  const asynkhandler = (func) => () => {}
//  const asynkhandler = (func) => async () => {}




// const asynchandler = (fun) => async (req,res,next) => {
//     try {
//         await fun(req,res,next)
//     } catch(error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
//  }