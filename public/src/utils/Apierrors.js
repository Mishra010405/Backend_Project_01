class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something Went wrong",
        error = [],
        statck = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.code = null
        this.message = message
        this.success = false
        this.errors = errors

        if(statck) {
            this.stack = statck
        }
        else {
                Error.captureStackTrace(this,this.constructor)
        }
        
    }
}

export {ApiError}