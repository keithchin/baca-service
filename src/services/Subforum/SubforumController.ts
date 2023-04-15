import { Request, Response } from "express";
import { ISubforumService } from "@src/interfaces/Subforum/ISubforumService";
import CreateSubforumDTO from "../../dto/Subforum/CreateSubforumDto";


export class SubforumController {
  constructor(private readonly subforumService: ISubforumService) {}


  async createSubforum(req: Request, res: Response) {
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

  async getSubforum(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subforum = await this.subforumService.getSubforumById(id);
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

  async getAllSubforums(req: Request, res: Response) {
    try {
      const subforums = await this.subforumService.getAllSubforums();
      res.status(200).json(subforums);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error getting subforums");
    }
  }

  async updateSubforum(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const subforum = await this.subforumService.updateSubforumById(id,{ name, description});
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

  async deleteSubforum(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subforum = await this.subforumService.deleteSubforumById(id);
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