import { Request, Response } from "express";
import mongoose from 'mongoose';
import { ISubforumService } from "@src/interfaces/Subforum/ISubforumService";
import CreateSubforumDTO from "@src/dto/Subforum/CreateSubforumDto";

export class SubforumController {
  constructor(private readonly subforumService: ISubforumService) {}


  createSubforum = async(req: Request, res: Response) => {
    try {
      const { title, description, createdBy } = req.body;
      const subforumData: CreateSubforumDTO = { title, description, createdBy };
      const subforum = await this.subforumService.createSubforum(subforumData);
      res.status(201).json(subforum);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating subforum");
    }
  }

  getSubforum = async(req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const subforum = await this.subforumService.getSubforumById(new mongoose.Schema.Types.ObjectId(id));
      if (subforum) {
        res.status(200).json(subforum);
      } else {
        res.status(404).send("Subforum not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error getting subforum");
    }
  }

  getAllSubforums = async(req: Request, res: Response) => {
    try {
      const subforums = await this.subforumService.getAllSubforums();
      res.status(200).json(subforums);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error getting subforums");
    }
  }

  updateSubforum = async(req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const subforum = await this.subforumService.updateSubforumById(new mongoose.Schema.Types.ObjectId(id),{ title, description});
      if (subforum) {
        res.status(200).json(subforum);
      } else {
        res.status(404).send("Subforum not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating subforum");
    }
  }

  deleteSubforum = async(req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const subforum = await this.subforumService.deleteSubforumById(new mongoose.Schema.Types.ObjectId(id));
      if (subforum) {
        res.status(200).json(subforum);
      } else {
        res.status(404).send("Subforum not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting subforum");
    }
  }
}