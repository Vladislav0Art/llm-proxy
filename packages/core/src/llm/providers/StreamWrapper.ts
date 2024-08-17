import { Readable } from 'stream';

export type DataCallback<T> = (data: T) => void
export type EndCallback = () => void;
export type ErrorCallback = (error: Error) => void;

export class StreamWrapper {
  private stream: Readable

  private onData: DataCallback<string>[] = [];
  private onEnd: EndCallback[] = [];
  private onError?: ErrorCallback;

  constructor(stream: Readable) {
    this.stream = stream;
    this.stream.on('data', (chunk: Buffer) => {
        this.onData.forEach(listener => listener(chunk.toString('utf8')));
      })
      .on('end', () => this.onEnd.forEach(listener => listener()))
      .on('error', (err) => this.onError ? this.onError(err) : null);
  }

  data(callback: DataCallback<string>): StreamWrapper {
    this.onData.push(callback);
    return this;
  }

  end(callback: EndCallback): StreamWrapper {
    this.onEnd.push(callback);
    return this;
  }

  error(callback: ErrorCallback): StreamWrapper {
    if (this.onError != null) {
      throw new Error("error callback is already assigned");
    }
    this.onError = callback;
    return this;
  }
}