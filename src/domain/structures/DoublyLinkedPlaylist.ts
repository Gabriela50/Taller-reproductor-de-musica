import Song from "../models/Song";
import PlaylistItem from "./PlaylistItem";

class DoublyLinkedPlaylist {
  private head: PlaylistItem | null;
  private tail: PlaylistItem | null;
  private current: PlaylistItem | null;
  private length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.length = 0;
  }

  public size(): number {
    return this.length;
  }

  public isEmpty(): boolean {
    return this.length === 0;
  }

  public getCurrentSong(): Song | null {
    return this.current ? this.current.song : null;
  }

  public insertAtStart(song: Song): void {
    const newItem = new PlaylistItem(song);

    if (this.isEmpty()) {
      this.head = newItem;
      this.tail = newItem;
      this.current = newItem;
    } else {
      newItem.next = this.head;
      if (this.head) {
        this.head.previous = newItem;
      }
      this.head = newItem;
    }

    this.length++;
  }

  public insertAtEnd(song: Song): void {
    const newItem = new PlaylistItem(song);

    if (this.isEmpty()) {
      this.head = newItem;
      this.tail = newItem;
      this.current = newItem;
    } else {
      newItem.previous = this.tail;
      if (this.tail) {
        this.tail.next = newItem;
      }
      this.tail = newItem;
    }

    this.length++;
  }

  public insertAtPosition(song: Song, position: number): boolean {
    if (position <= 0) {
      this.insertAtStart(song);
      return true;
    }

    if (position >= this.length) {
      this.insertAtEnd(song);
      return true;
    }

    const currentNode = this.getNodeAt(position);

    if (!currentNode) {
      return false;
    }

    const newItem = new PlaylistItem(song);
    const previousNode = currentNode.previous;

    newItem.next = currentNode;
    newItem.previous = previousNode;

    if (previousNode) {
      previousNode.next = newItem;
    }

    currentNode.previous = newItem;
    this.length++;

    return true;
  }

  public removeAtPosition(position: number): Song | null {
    if (position < 0 || position >= this.length || this.isEmpty()) {
      return null;
    }

    let nodeToRemove: PlaylistItem | null = null;

    if (this.length === 1) {
      nodeToRemove = this.head;
      this.head = null;
      this.tail = null;
      this.current = null;
      this.length = 0;
      return nodeToRemove ? nodeToRemove.song : null;
    }

    if (position === 0) {
      nodeToRemove = this.head;
      this.head = this.head ? this.head.next : null;

      if (this.head) {
        this.head.previous = null;
      }
    } else if (position === this.length - 1) {
      nodeToRemove = this.tail;
      this.tail = this.tail ? this.tail.previous : null;

      if (this.tail) {
        this.tail.next = null;
      }
    } else {
      nodeToRemove = this.getNodeAt(position);

      if (!nodeToRemove) {
        return null;
      }

      const previousNode = nodeToRemove.previous;
      const nextNode = nodeToRemove.next;

      if (previousNode) {
        previousNode.next = nextNode;
      }

      if (nextNode) {
        nextNode.previous = previousNode;
      }
    }

    if (this.current === nodeToRemove) {
      this.current = nodeToRemove?.next ?? nodeToRemove?.previous ?? this.head;
    }

    this.length--;
    return nodeToRemove ? nodeToRemove.song : null;
  }

  public moveNext(): Song | null {
    if (!this.current) {
      return null;
    }

    if (this.current.next) {
      this.current = this.current.next;
    }

    return this.current.song;
  }

  public movePrevious(): Song | null {
    if (!this.current) {
      return null;
    }

    if (this.current.previous) {
      this.current = this.current.previous;
    }

    return this.current.song;
  }

  public setCurrentByIndex(index: number): Song | null {
    const node = this.getNodeAt(index);

    if (!node) {
      return null;
    }

    this.current = node;
    return node.song;
  }

  public toArray(): Song[] {
    const songs: Song[] = [];
    let currentNode = this.head;

    while (currentNode) {
      songs.push(currentNode.song);
      currentNode = currentNode.next;
    }

    return songs;
  }

  private getNodeAt(index: number): PlaylistItem | null {
    if (index < 0 || index >= this.length) {
      return null;
    }

    let currentNode: PlaylistItem | null;
    let currentIndex: number;

    if (index < this.length / 2) {
      currentNode = this.head;
      currentIndex = 0;

      while (currentNode && currentIndex < index) {
        currentNode = currentNode.next;
        currentIndex++;
      }
    } else {
      currentNode = this.tail;
      currentIndex = this.length - 1;

      while (currentNode && currentIndex > index) {
        currentNode = currentNode.previous;
        currentIndex--;
      }
    }

    return currentNode;
  }
}

export default DoublyLinkedPlaylist;