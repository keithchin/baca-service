export default class CreatePostDto {
    title: string;
    content: string;
    authorId: string;
    subforumId: string;

    constructor(title: string, content: string, authorId: string, subforumId: string) {
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.subforumId = subforumId;
    }
}