let btnscrap = document.getElementById('scrap-profile')

btnscrap.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab !== null) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapingProfile,
    });
  }
})

const scrapingProfile = () => {
  const wait = function (milliseconds) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, milliseconds);
    });
  };

  class Profile {

    /*  -- Part 01 --  */

    // Extracting the profile name
    get name() {
      let elementNameProfile = document.querySelector("h1.text-heading-xlarge");
      let getname = elementNameProfile?.innerText;
      return getname;
    }

    // Extracting the position from the profile
    get curposition() {
      let elementPositionProfile = document.querySelector("div.text-body-medium");
      let getposition = elementPositionProfile?.innerText;
      return getposition;
    }

    // Extracting the location of the profile
    get location() {
      let elementLocationProfile = document.querySelector("span.text-body-small.inline");
      let getlocation = elementLocationProfile?.innerText;
      return getlocation;
    }

    // Extracting information about the profile
    get aboutme() {
      let elementAboutProfile = document.querySelector("div.inline-show-more-text.mt4");
      let getaboutme = elementAboutProfile?.innerText;
      return getaboutme;
    }


    /*  -- Part 02 -- */

    // Extracting Educational level
    get level() {
      let elementEducationallevel = document.querySelectorAll("span.pv-entity__comma-item");
      return elementEducationallevel;
    }

    // Extracting education center
    get center() {
      let elementStudyCenter = document.querySelectorAll("h3.pv-entity__school-name");
      return elementStudyCenter;
    }
    
    // Extracting study period
    get stdperiod() {
      let elementStudyPeriod = document.querySelectorAll("p.pv-entity__dates > span:nth-child(2)");
      return elementStudyPeriod;
    }
    
    // Array of Eduaction Information
    get arrStudies() {
      let elementStudies = document.querySelectorAll("#education-section > ul > li");
      let arrayStudies = Array.from(elementStudies);
      let arr = [];
      for (let i = 0; i < arrayStudies.length; i++) {
        let periodo = this.stdperiod[i] == undefined ? "" : this.stdperiod[i].querySelectorAll("time")
        arr[i] = {
          "Center of Studies": this.center[i] ?.innerText,
          "Level of Studies": this.level[i] == undefined ? "" : this.level[i].innerText,
          "Study Period": {
            "Start": periodo[0] == undefined ? "" : periodo[0].innerText,
            "End": periodo[1] != undefined ? periodo[1].innerText : periodo[0] == undefined ? "" : periodo[0].innerText
          }
        }
      }
      return arr;
    }

    
    /*  -- Part 03 -- */

    // Extracting work position
    get position() {
      let elementWorkPosition = document.querySelectorAll("div.pv-entity__summary-info > h3");
      return elementWorkPosition;
    }

    // Extracting company information
    get company() {
      let elementWorkCompany = document.querySelectorAll("div.pv-entity__summary-info > p.pv-entity__secondary-title");
      return elementWorkCompany;
    }

    // Extracting working period
    get wrkperiod() {
      let elementWorkingPeriod = document.querySelectorAll("div.display-flex > h4.pv-entity__date-range > span:nth-child(2)")
      return elementWorkingPeriod;
    }

    // Extracting job functions
    get functions() {
      let elementJobFunctions = document.querySelectorAll("div.inline-show-more-text.pv-entity__description")
      return elementJobFunctions;
    }
    
    // Array of Eduaction Information
    get arrJobs() {
      let elementJobs = document.querySelectorAll("#experience-section > ul > li");
      let arrayJobs = Array.from(elementJobs);
      let arr = [];
      for (let i = 0; i < arrayJobs.length; i++) {
        let periodo = this.wrkperiod[i].innerText.split("–")
        let fncs = this.functions[i] == undefined ? "" : this.functions[i].innerText.split("\n")
        arr[i] = {          
          "Work Position": this.position[i] ?.innerText,
          "Workplace": this.company[i] ?.innerText,
          "Working Period": {
            "Start": periodo[0],
            "End": periodo[1]
          },
          "Functions": fncs[fncs.length - 1] == "ver más" ? fncs.slice(0, fncs.length - 2) : fncs[fncs.length - 1] == "ver menos" ? fncs.slice(0, fncs.length - 1) : fncs
        }
      }
      return arr;
    }

  }

  // Console display
  let profileInfo = new Profile();
  let perfil = {

    "Personal Information": {
      "Name": profileInfo.name,
      "Position": profileInfo.curposition,
      "Location": profileInfo.location,
      "About me": profileInfo.aboutme
    },

    "Education Information": profileInfo.arrStudies,

    "Working Information": profileInfo.arrJobs

  };

  console.log("Profile: %o", perfil)
  //console.table(perfil["Personal Information"])
  //console.table(perfil["Education Information"])
  //console.table(perfil["Working Information"])

}