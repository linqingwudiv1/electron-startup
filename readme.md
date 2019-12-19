        /**
         * Asynchronous extractAllTo
         *
         * @param targetPath Target location
         * @param overwrite If the file already exists at the target path, the file will be overwriten if this is true.
         *                  Default is FALSE
         * @param callback
         */
        extractAllToAsync: function (/*String*/targetPath, /*Boolean*/overwrite, /*Function*/callback) {
            if (!callback) {
                callback = function() {}
            }
            overwrite = overwrite || false;
            if (!_zip) {
                callback(new Error(Utils.Errors.NO_ZIP));
                return;
            }

            var entries = _zip.entries;
            var i = entries.length;
            entries.forEach(function (entry) {
                if (i <= 0) return; // Had an error already

                var entryName = pth.normalize(entry.entryName.toString());

                if (entry.isDirectory) {
                    Utils.makeDir(sanitize(targetPath, entryName));
                    if (--i === 0)
                        callback(undefined);
                    return;
                }
                entry.getDataAsync(function (content, err) {
                    if (i <= 0) return;
                    if (err) {
                        callback(new Error(err));
                        return;
                    }
                    if (!content) {
                        i = 0; 
                        callback(new Error(Utils.Errors.CANT_EXTRACT_FILE));
                        return;
                    }

                    Utils.writeFileToAsync(sanitize(targetPath, entryName), content, overwrite, function (succ) {
                        try {
                            fs.utimesSync(pth.resolve(targetPath, entryName), entry.header.time, entry.header.time);
                        } catch (err) {
                            callback(new Error('Unable to set utimes'));
                        }
                        if (i <= 0) return;
                        if (!succ) {
                            i = 0;
                            callback(new Error('Unable to write'));
                            return;
                        }
                        if (--i === 0)
                            callback(undefined);
                    });
                });
            })
        }