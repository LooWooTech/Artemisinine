using System.Windows.Forms;

namespace LoowooTech.Artemisinine.Common
{
    public static class FileHelper
    {
        public static string Open(string Filter, string Title)
        {
            OpenFileDialog openfiledialog = new OpenFileDialog();
            openfiledialog.Filter = Filter;
            openfiledialog.Title = Title;
            if (openfiledialog.ShowDialog() == DialogResult.OK)
            {
                return openfiledialog.FileName;
            }
            return string.Empty;
        }

        public static string Save(string Filter, string Title)
        {
            SaveFileDialog savefileDialog = new SaveFileDialog();
            savefileDialog.Filter = Filter;
            savefileDialog.Title = Title;
            if (savefileDialog.ShowDialog() == DialogResult.OK)
            {
                return savefileDialog.FileName;
            }
            return string.Empty;
        }

        public static string Save()
        {
            FolderBrowserDialog folderBrower = new FolderBrowserDialog();
            if (folderBrower.ShowDialog() == DialogResult.OK)
            {
                return folderBrower.SelectedPath;
            }

            return string.Empty;
        }
    }
}
