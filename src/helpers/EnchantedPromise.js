class EnchantedPromise extends Promise {
  constructor(executor) {
    super((resolve, reject) => executor(resolve, reject));

    this.returnValue = null;
    this.pending = true;
    this.rejected = false;
    this.fulfilled = false;
  }

  then = (onFulfilled, onRejected) => {
    this.returnValue = super.then(
      this.onFulfilled(onFulfilled),
      this.onRejected(onRejected),
    );
    return this;
  };

  onFulfilled = onFulfilled => result => {
    this.fulfilled = true;
    this.pending = false;
    onFulfilled(result);
  };

  onRejected = onRejected => error => {
    this.rejected = true;
    this.pending = false;
    onRejected(error);
  };

  isFulfilled = () => this.fulfilled;

  isPending = () => this.pending;

  isRejected = () => this.rejected;
}

export default EnchantedPromise;
