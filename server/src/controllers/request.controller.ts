import { NextFunction, Request, Response } from 'express';

import { CustomError, GenericServerError } from '../util/helpers';

import { Request as PhanRequest } from '../models/Request';
import { IPhanRequest } from '../types/index';

class RequestController {
  public async getRequest(req: Request, res: Response, next: NextFunction) {
    const requestId: string = req.params.requestId;

    try {
      const phanRequest = await PhanRequest.findById(requestId);

      if (!phanRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }

      return res.status(200).json(phanRequest);
    } catch (error) {
      console.error(error);
      if (error.kind === 'ObjectId') {
        next(new CustomError(404, 'Request not found'));
      }
      next(new GenericServerError());
    }
  }

  public async createRequest(req: Request, res: Response, next: NextFunction) {
    const { ...requestFields } = req.body;

    // construct request
    // TODO
    // for user id we may want to use req.user.id, because we know it will exist
    // otherwise this will not execute as the auth middleware will err out
    const request: IPhanRequest = { ...requestFields };

    // attempt creating new document
    try {
      const newRequest = await PhanRequest.create(request);
      return res.status(200).json(newRequest);
    } catch (error) {
      console.error(error);
      next(new GenericServerError());
    }
  }

  public async updateRequest(req: Request, res: Response, next: NextFunction) {}

  public async deleteRequest(req: Request, res: Response, next: NextFunction) {
    const requestId: string = req.params.requestId;

    try {
      await PhanRequest.findByIdAndDelete(requestId);
      return res.status(200).json({ message: 'Request successfully deleted' });
    } catch (error) {
      console.error(error);
      if (error.kind === 'ObjectId') {
        next(new CustomError(404, 'Request not found'));
      }
      next(new GenericServerError());
    }
  }
}

export = new RequestController();
