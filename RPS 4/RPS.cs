﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using System.Linq;
using System.ComponentModel;
using System.Diagnostics;
using System.Threading;
using Microsoft.VisualBasic.FileIO;
//using System.Windows.Forms.HtmlElement;

namespace RPS {
    public class Screensaver : ApplicationContext {
        public static int CM_ALL = -1;

        private bool configInitialised = false;
        public bool applicationClosing = false;
        private IntPtr previewHwnd;
        private System.Windows.Forms.Keys previousKey;
        private bool configHidden = false;

        public int currentMonitor = CM_ALL;

        public enum Actions { Config, Preview, Screensaver, Slideshow };
        public Actions action;
        public Config config;
        public Monitor[] monitors;
        public FileNodes fileNodes;

        private Screensaver(Actions action, IntPtr previewHwnd) {
            this.action = action;
            this.previewHwnd = previewHwnd;
            this.config = new Config(this);
            this.config.PreviewKeyDown += new System.Windows.Forms.PreviewKeyDownEventHandler(this.PreviewKeyDown);
            this.config.browser.PreviewKeyDown += new System.Windows.Forms.PreviewKeyDownEventHandler(this.PreviewKeyDown);
//            this.config.browser.OnMouseMove += new System.Windows.Forms.MouseEventHandler(this.MouseMove);

            this.config.browser.Navigate(new Uri(Constants.getDataFolder(Constants.ConfigHtmlFile)));
            this.config.browser.DocumentCompleted += new System.Windows.Forms.WebBrowserDocumentCompletedEventHandler(this.ConfigDocumentCompleted);
            if (this.action == Actions.Config) this.config.Show();
            // Wait for config document to load to complete initialisation
        }

        private void ConfigDocumentCompleted(object sender, System.Windows.Forms.WebBrowserDocumentCompletedEventArgs e) {
            if (this.action != Actions.Config) {
                // Complete initialisation when config.html is loaded.
                if (!this.configInitialised && this.config.browser.Url.Segments.Last().Equals(Constants.ConfigHtmlFile)) {
                    // Avoid double loading config from DB
                    if (config.getValue("folders") == null) {
                        this.config.loadPersistantConfig();
                    }
                    //MessageBox.Show("loadPersistantConfig() loaded");
                    this.configInitialised = true;

                    fileNodes = new FileNodes(this.config, this);
                    
                    System.Drawing.Color backgroundColour = System.Drawing.ColorTranslator.FromHtml(this.config.getValue("backgroundColour"));

                    if (this.config.getCheckboxValue("useFilter")) {
                        this.fileNodes.setFilterSQL(this.config.getValue("filter"));
                    }

                    if (this.action != Actions.Preview) {
                        this.monitors = new Monitor[Screen.AllScreens.Length];
                        var i = 0;
                        foreach (Screen screen in Screen.AllScreens) {
//                            MessageBox.Show("Screen " + i);
                            this.monitors[i] = new Monitor(screen.Bounds, i, this);
                            this.monitors[i].browser.PreviewKeyDown += new System.Windows.Forms.PreviewKeyDownEventHandler(this.PreviewKeyDown);
                            this.monitors[i].PreviewKeyDown += new System.Windows.Forms.PreviewKeyDownEventHandler(this.PreviewKeyDown);
                            // Avoid white flash by hiding browser and setting form background colour. (Focus on browser on DocumentCompleted to process keystrokes)
                            this.monitors[i].browser.Hide();
                            try { 
                                this.monitors[i].BackColor = backgroundColour;
                            } catch (System.ArgumentException ae) { }
                            this.monitors[i].Show();
                            //this.monitors[i].nextImage();
                            i++;
                        }
                        for (i = 0; i < this.monitors.Length; i++) {
                            
                        }
                    }
                }
            }
        }

        private void DoWorkDeleteFile(object sender, DoWorkEventArgs e) {
            //            Debug.WriteLine(this.config.getValue("folders"));
            BackgroundWorker worker = sender as BackgroundWorker;
            // Lower priority to ensure smooth working of main screensaver
            System.Diagnostics.Process.GetCurrentProcess().PriorityClass = System.Diagnostics.ProcessPriorityClass.BelowNormal;
            int monitorId = Convert.ToInt32(((object[])(e.Argument))[0]);
            string filename = Convert.ToString(((object[])(e.Argument))[1]);
            int i = 0;
            while (File.Exists(filename) && i < 100) {
                i++;
                try {
                    FileSystem.DeleteFile(filename, UIOption.OnlyErrorDialogs, RecycleOption.SendToRecycleBin, UICancelOption.DoNothing);
                    this.fileNodes.deleteFromDB(filename);
                } catch (ArgumentNullException ane) {
                    this.monitors[i].showInfoOnMonitor("Nothing to delete");
                } catch (Exception ex) {
                    if (this.monitors[i].imagePath() == filename) this.monitors[i].showInfoOnMonitor("Deleting\n"+Path.GetFileName(filename));
				    Thread.Sleep(1000);
                }

            }


        }

        public void showInfoOnMonitors(string info) {
            this.showInfoOnMonitors(info, false);
        }

        public void showInfoOnMonitors(string info, bool highPriority) {
            for (int i = 0; i < this.monitors.Length; i++) {
                if ((this.currentMonitor == CM_ALL) || (this.currentMonitor == i)) {
                    this.monitors[i].showInfoOnMonitor(info, highPriority);
                    //this.monitors[i].browser.Document.InvokeScript("showInfo", new String[] { info });
                }
            }
        }

        public void pauseAll(bool showInfo) {
            for (int i = 0; i < this.monitors.Length; i++) {
                this.monitors[i].timer.Enabled = false;
                if (showInfo) this.monitors[i].showInfoOnMonitor("||");
            }
        }

        public void resumeAll(bool showInfo) {
            for (int i = 0; i < this.monitors.Length; i++) {
                this.monitors[i].timer.Enabled = true;
                if (showInfo) this.monitors[i].showInfoOnMonitor("|>");
            }
        }

        /*
                        public void startTimers() {
                            //for (int i = (this.monitors.Length - 1); i >= 0 ; i--) {
                            for (int i = 0; i < this.monitors.Length; i++) {
                                if (this.currentMonitor == CM_ALL || this.currentMonitor == i) {
                                    this.monitors[i].timer.Start();
                                }
                            }
                        }

                        public void stopTimers() {
                            for (int i = 0; i < this.monitors.Length; i++) {
                                if (this.currentMonitor == CM_ALL || this.currentMonitor == i) {
                                    this.monitors[i].timer.Stop();
                                }
                            }
                        }
                        */

        public void MouseMove(object sender, MouseEventArgs e) {
            Console.Beep();
        }

        public void PreviewKeyDown(object sender, PreviewKeyDownEventArgs e) {
            // Ignore shortcut keys when Config screen is visible
            // Ignore repeated keys
            if (this.previousKey == e.KeyCode) {
                this.previousKey = 0;
            } else {
                if (this.config.Visible) {
                    switch (e.KeyCode) {
                        case Keys.Escape:
                            if (this.config.WindowState == FormWindowState.Minimized) {
                                this.config.WindowState = FormWindowState.Normal;
                            } else {
                                this.configHidden = true;
                                this.config.Hide();
                            }
                        break;
                    }
                } else {
		            Keys KeyCode = e.KeyCode;
		            // fix German keyboard codes for [ ]
		            if (e.Alt && e.Control) {
			            switch (e.KeyCode) {
				            case Keys.D8: 
                                KeyCode = Keys.OemOpenBrackets;
					            //KeyCode = Keys.OemOpenBrackets;
				            break;
				            case Keys.D9:
					            KeyCode = Keys.OemCloseBrackets;
				            break;
			            }
		            }
                    switch (KeyCode) {
                        case Keys.Escape:
                            if (this.configHidden) {
                                this.configHidden = false;
                            } else {
                                this.OnExit();
                            }
                            break;
                        case Keys.C:
                            this.showInfoOnMonitors("Calendar probably won' be implemented");
                        break;
                        case Keys.E:
                            for (int i = 0; i < this.monitors.Length; i++) {
                                if (this.currentMonitor == CM_ALL || this.currentMonitor == i) {
                                    if (this.monitors[i].imagePath() != null) {
                                        Process.Start("explorer.exe", "/e,/select," + this.monitors[i].imagePath());
                                    }
                                }
                            }
                            if (Convert.ToBoolean(this.config.getCheckboxValue("closeAfterImageLocate"))) this.OnExit();
                        break;
                        case Keys.F:
                        case Keys.NumPad7:
                            for (int i = 0; i < this.monitors.Length; i++) {
                                if (this.currentMonitor == CM_ALL || this.currentMonitor == i) {
                                    this.config.setValue("showFilenameM" + (i + 1), Convert.ToString(this.monitors[i].InvokeScript("toggle", new string[] { "#filename" })));
                                }
                            }
                        break;
                        case Keys.M:
                            this.showInfoOnMonitors("ToDo: Implement Metadata form");
                        break;
                        case Keys.N:
                            for (int i = 0; i < this.monitors.Length; i++) {
                                if (this.currentMonitor == CM_ALL || this.currentMonitor == i) {
                                    this.config.setValue("showQuickMetadataM" + (i + 1), Convert.ToString(this.monitors[i].InvokeScript("toggle", new string[] { "#quickMetadata" })));
                                }
                            }
                        break;
                        case Keys.P:
                            for (int i = 0; i < this.monitors.Length; i++) {
                                if (this.currentMonitor == CM_ALL || this.currentMonitor == i) {
                                    this.monitors[i].timer.Enabled = !this.monitors[i].timer.Enabled;
                                    if (this.monitors[i].timer.Enabled) this.monitors[i].showInfoOnMonitor("|>");
                                    else this.monitors[i].showInfoOnMonitor("||");
                                }
                            }

                        break;
                        case Keys.R: case Keys.NumPad1:
                            if (this.config.changeOrder() == Config.Order.Random) {
                                this.showInfoOnMonitors("Randomising");
                            } else {
                                this.showInfoOnMonitors("Sequential");
                            };
                        break;
                        case Keys.S:
                            // Don't hide config screen if application is in Config mode
                            if (this.action != Actions.Config) {
                                if (this.config.Visible) this.config.Hide();
                                else this.config.Show();
                            } else {

                            }
                        break;
                        case Keys.T: case Keys.NumPad5:
                            for (int i = 0; i < this.monitors.Length; i++) {
                                if (this.currentMonitor == CM_ALL || this.currentMonitor == i) {
                                    string display = "true";
                                    string clockType = "current";
                                    switch(this.config.getValue("clockM" + (i + 1))) {
                                        case "none":
                                            this.config.setValue("currentClockM" + (i + 1), "checked");
                                        break;
                                        case "current":
                                            this.config.setValue("elapsedClockM" + (i + 1), "checked");
                                            clockType = "elapsed";
                                        break;
                                        case "elapsed":
                                            this.config.setValue("noClockM" + (i + 1), "checked");
                                            display = "false";
                                        break;
                                    }
                                    this.monitors[i].InvokeScript("setClockType", new string[] { clockType  });
                                    this.monitors[i].InvokeScript("toggle", new string[] { "#clock", display });
                                }
                            }
                        break;
                        case Keys.W:
                            string[] paths = new string[this.monitors.Length];
                            for (int i = 0; i < this.monitors.Length; i++) {
                                paths[i] = Convert.ToString(this.monitors[i].imagePath());
                                if (this.currentMonitor == CM_ALL || this.currentMonitor == i) {
                                    this.monitors[i].showInfoOnMonitor("Setting as wallpaper");
                                }
                            }
                            Wallpaper wallpaper = new Wallpaper(this);
                            wallpaper.setWallpaper(this.currentMonitor, paths);
                        break;
                        case Keys.D0:
                            this.currentMonitor = CM_ALL;
                            for (int i = 0; i < this.monitors.Length; i++) {
                                this.monitors[i].browser.Document.InvokeScript("identify");
                            }
                            break;
                        case Keys.D1:case Keys.D2:case Keys.D3:
                        case Keys.D4:case Keys.D5:case Keys.D6:
                        case Keys.D7:case Keys.D8:case Keys.D9:
                            int monitorId = e.KeyValue-49;
                            if (monitorId < this.monitors.Length) {
                                this.currentMonitor = monitorId;
                                this.monitors[monitorId].browser.Document.InvokeScript("identify");
                            }
                        break;
                        case Keys.NumPad4: case Keys.Left:
                            //this.stopTimers();
                            for (int i = 0; i < this.monitors.Length; i++) {
                            //for (int i = (this.monitors.Length - 1); i >= 0 ; i--) {

                                if (this.currentMonitor == CM_ALL || this.currentMonitor == i) {
                                    this.monitors[i].timer.Stop();
                                    this.monitors[i].previousImage();
                                    this.monitors[i].showInfoOnMonitor("<<");
                                    this.monitors[i].showImage(false);
                                    this.monitors[i].startTimer();
                                }
                            }
                            //this.startTimers();
                        break;
                        case Keys.NumPad6: case Keys.Right:
                            //this.stopTimers();
                            for (int i = 0; i < this.monitors.Length; i++) {
                                if (this.currentMonitor == CM_ALL || this.currentMonitor == i) {
                                    this.monitors[i].timer.Stop();
                                    this.monitors[i].nextImage();
                                    this.monitors[i].showInfoOnMonitor(">>");
                                    this.monitors[i].showImage(false);
                                    this.monitors[i].startTimer();
                                }
                            }
                            //this.startTimers();
                        break;
                        case Keys.NumPad2: case Keys.Down:
                            //this.stopTimers();
                            for (int i = 0; i < this.monitors.Length; i++) {
                                if (this.currentMonitor == CM_ALL || this.currentMonitor == i) {
                                    //this.monitors[i].offset++;
                                    this.monitors[i].timer.Stop();
                                    this.monitors[i].offsetImage(1);
                                    //this.monitors[i].previousImage();
                                    this.monitors[i].showImage(false);
                                    this.monitors[i].showInfoOnMonitor("v (" + this.monitors[i].offset + ")");
                                    this.monitors[i].startTimer();
                                }
                            }
                            //this.startTimers();
                        break;
                        case Keys.NumPad8: case Keys.Up:
                           // this.stopTimers();
                            for (int i = 0; i < this.monitors.Length; i++) {
                                if (this.currentMonitor == CM_ALL || this.currentMonitor == i) {
                                    //this.monitors[i].offset--;
                                    this.monitors[i].timer.Stop();
                                    this.monitors[i].offsetImage(-1);
                                    //this.monitors[i].nextImage();
                                    this.monitors[i].showImage(false);
                                    this.monitors[i].showInfoOnMonitor("^ (" + this.monitors[i].offset + ")");
                                    this.monitors[i].startTimer();
                                }
                            }
                           // this.startTimers();
                        break;
                        case Keys.OemOpenBrackets:
                        case Keys.OemCloseBrackets: 
                        case Keys.Oemplus:
                            this.showInfoOnMonitors("ToDo: Implement image rotation");
                            // See http://www.useragentman.com/blog/2010/03/09/cross-browser-css-transforms-even-in-ie/#more-896 for rotation based on info.
                        break;
                        case Keys.Delete:
                            if (this.config.getCheckboxValue("deleteKey")) {
                                this.pauseAll(false);
                                for (int i = 0; i < this.monitors.Length; i++) {
                                    if (this.currentMonitor == CM_ALL || this.currentMonitor == i) {
                                        bool deleteFile = true;
                                        string filename = this.monitors[i].imagePath();
                                        if (filename != null && filename.Length > 0 && File.Exists(filename)) {
                                            Cursor.Show();
                                            this.monitors[i].Focus();
                                            if (DialogResult.Yes == MessageBox.Show("Are you sure you want to sent '" + Path.GetFileName(filename) + "' to the Recycle Bin?", "Confirm File Delete", MessageBoxButtons.YesNo, MessageBoxIcon.Exclamation)) {
                                                deleteFile = true;
                                            } else {
                                                deleteFile = false;
                                            }
                                            Cursor.Hide();
                                            if (deleteFile) {
                                                BackgroundWorker bgwDeleteFile = new BackgroundWorker();
                                                bgwDeleteFile.DoWork += new DoWorkEventHandler(DoWorkDeleteFile);
                                                bgwDeleteFile.RunWorkerAsync(new Object[] {i, filename});
                                            }
                                        }
                                    }
                                }
                                this.resumeAll(false);
                            }
                        break;
                        default:
                            /*Debug.WriteLine(((Control)sender).Parent.ToString());
                            Config config = ((Control)sender).Parent as Config;
                            config.Message("Sender:" + sender.ToString() + " Key:" + e.KeyValue);*/
                            //this.config.Message("Sender:" + sender.ToString() + " Key:" + e.KeyValue);
                        break;
                    }
                    this.previousKey = e.KeyCode;
                }
            } 
            //Debug.Write(sender.ToString() + " " + e.KeyCode);
        }

        public void OnExit() {
            /***
             * ToDo: Store value for monitor 0 rather than last monitor
             ***/
            this.config.setValue("sequentialStartImageId", this.fileNodes.currentSequentialSeedId.ToString());
            string imageIds = "";
            for(int i = 0; i < this.monitors.Length; i++) {
                imageIds += this.monitors[i].imageId() + ";";
            }
            this.config.setValue("randomStartImages", imageIds);            
            this.config.safePersistantConfig();
            if (this.fileNodes != null) this.fileNodes.OnExitCleanUp();
            // Manually call config close to ensure it will not cancel the close.
            this.applicationClosing = true;
            Application.Exit();
//            Application.Q
            //Exit();
        }

        private void OnFormClosed(object sender, EventArgs e) {
            this.OnExit();
            //ExitThread();
        }

   
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main(string[] args) {
            IntPtr previewHwnd = IntPtr.Zero;
            Actions action = Actions.Screensaver;
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            if (args.Length > 0) {
                string arg1 = args[0].ToLower().Trim();
                string arg2 = null;
                if (arg1.Length > 2) {
                    arg2 = arg1.Substring(3).Trim();
                    arg1 = arg1.Substring(0, 2);
                } else if (args.Length > 1) {
                    arg2 = args[1];
                }
                switch (arg1[1]) {
                    case 'c':
                        action = Actions.Config;
                    break;
                    case 'p':
                        action = Actions.Preview;
                        previewHwnd = new IntPtr(long.Parse(arg2));
                    break;
                }
            }
            Screensaver screensaver = new Screensaver(action, previewHwnd);
            switch (action) {
                case Actions.Config:
                    Application.Run(screensaver);
                break;
                case Actions.Preview:
                    screensaver.monitors = new Monitor[1];
                    screensaver.monitors[0] = new Monitor(previewHwnd, 0, screensaver);
                    screensaver.monitors[0].FormClosed += new FormClosedEventHandler(screensaver.OnFormClosed);
                    screensaver.monitors[0].PreviewKeyDown += new System.Windows.Forms.PreviewKeyDownEventHandler(screensaver.PreviewKeyDown);
                    screensaver.monitors[0].browser.PreviewKeyDown += new System.Windows.Forms.PreviewKeyDownEventHandler(screensaver.PreviewKeyDown);
                    Application.Run(screensaver.monitors[0]);
                break;
                default:
                    Application.Run(screensaver);
                break;

            }
        }
    }
}