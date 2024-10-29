import { NextFunction, Request, Response } from 'express'

const catcher =
  (
    cb: (req: Request, res: Response, next: NextFunction) => Promise<void>,
    onFail?: (req: Request) => Promise<void>,
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      onFail && onFail(req)
      res.status(500).json({ error: error.message })
    }
  }

export default catcher
