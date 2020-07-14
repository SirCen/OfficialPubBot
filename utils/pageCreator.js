module.exports = class PageCreator {
    constructor(author, pages, back, next, firstLast, bookmark, endMessage) {
        this.current = 0;
        this.total = pages.length;
        this.author = author;
        this.pages = pages;
        this.back = back;
        this.next = next;
        this.first = '↙';
        this.last = '↘';
        this.endMessage = endMessage;
        this.bookmark = bookmark;
    }

    start(pendingMessage) {
        this.message = pendingMessage;
        if (this.message.member) {
            this.hasPermission = this.message.member.hasPermission('MANAGE_MESSAGES');
        } else {
            this.hasPermission = false;
        }
        if (this.pages.length === 1) {
            pendingMessage.edit(this.pages[0]);
        } else if (this.pages.length === 2) {
            pendingMessage.edit(this.pages[0])
            .then(msg => msg.react(this.back))
            .then(backReact => backReact.message.react(this.next))
            .then((backReact) => {
                this.message = backReact.message;
                const emoji = [this.back, this.next];
                const reactionFilter = (reaction, user) => {
                    if (reaction.me && emoji.includes(reaction.emoji.name)) {
                        if (user.id === this.author.id && user.id !== this.message.author.id) {
                            return true;
                        }
                    } 
                    return false;
                };

                this.collector = this.message.createReactionCollector(reactionFilter, {time: 300000});
                this.collector.on('collect', (reaction) => {
                    if (this.hasPermission) {
                        reaction.remove(this.author);
                    }
                    switch (reaction.emoji.toString()) {
                        case this.back:
                            if (this.current !== 0) {
                                this.current -= 1;
                            }
                            break;
                        case this.next:
                            if (this.current !== this.total - 1) {
                                this.current += 1;
                            }
                            break;
                        default:
                            break; 
                    }
                    this.refresh();
                });
                    this.collector.on('end', () => {
                        this.refresh();
                    });
                });
        } else if (this.pages.length > 2) {
            pendingMessage.edit(this.pages[0])
            .then(edit => edit.react('↙'))
            .then(first => first.message.react(this.back))
            .then(back => back.message.react(this.next))
            .then(next => next.message.react('↘'))
            .then((last) => {
                this.message = last.message;
                const emojis = ['↙', this.back, this.next, '↘'];
                const reactionFilter = (reaction, user) => {
                    if (reaction.me && emojis.includes(reaction.emoji.name)) {
                        if (user.id === this.author.id && user.id !== this.message.author.id) {
                            return true;
                        }
                    }
                    return false;   
                };

                this.collector = this.message.createReactionCollector(reactionFilter, {time: 300000});
                this.collector.on('collect', (reaction) => {
                    if (this.hasPermission) {
                        reaction.remove(this.author);
                    }
                    switch (reaction.emoji.toString()) {
                        case this.first:
                            if (this.current !== 0) {
                                this.current = 0;
                            }
                            break;
                        case this.back:
                            if (this.current !== 0) {
                                this.current -= 1;
                            }
                            break;
                        case this.next:
                            if (this.current !== this.total - 1) {
                                this.current += 1;
                            }
                            break;
                        case this.last:
                            if (this.current !== this.total -1) {
                                this.current = this.total - 1;
                            }
                            break;
                        default:
                            break;
                    }
                    this.refresh();
                });
                this.collector.on('end', () => {
                    this.refresh();
                });
            });
        }
    }
    refresh() {
        this.message.edit(this.pages[this.current]);
    }
}