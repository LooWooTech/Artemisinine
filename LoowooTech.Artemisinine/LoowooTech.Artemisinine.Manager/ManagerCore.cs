using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoowooTech.Artemisinine.Manager
{
    public class ManagerCore
    {
        public static ManagerCore Instance = new ManagerCore();

        private UserManager _userManager;
        public UserManager UserManager
        {
            get { return _userManager == null ? _userManager = new UserManager() : _userManager; }
        }

        private FileManager _fileManager;
        public FileManager FileManager
        {
            get { return _fileManager == null ? _fileManager = new FileManager() : _fileManager; }
        }
    }
}
