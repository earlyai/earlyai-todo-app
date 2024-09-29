const fs = require('fs-extra');
const path = require('path');

// '.' means the directory where the script is run
const targetDir = process.cwd();  // process.cwd() gets the current working directory

function deleteMatchingFolders(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;

        files.forEach(file => {
            const fullPath = path.join(dir, file);
            fs.lstat(fullPath, (err, stats) => {
                if (err) throw err;

                if (stats.isDirectory()) {
                    if (file.endsWith('.early.test')) {
                        fs.remove(fullPath, err => {
                            if (err) throw err;
                            console.log(`Deleted folder: ${fullPath}`);
                        });
                    } else {
                        // Recurse into subdirectories
                        deleteMatchingFolders(fullPath);
                    }
                }
            });
        });
    });
}

// Start searching from the current working directory
deleteMatchingFolders(targetDir);
