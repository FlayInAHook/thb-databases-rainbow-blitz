using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class HotbarUI : MonoBehaviour
{
    public List<Image> skillSlots = new List<Image>(); // Array of images representing skill slots
    public List<TextMeshProUGUI> skillCounts = new List<TextMeshProUGUI>(); // Array of texts to show counts of each skill

    private int selectedIndex = 0;
    public SkillType selectedSkill => (SkillType) selectedIndex;

    void Awake()
    {
        // Find and assign the skill slots and their text components
        Image[] allImages = GetComponentsInChildren<Image>(includeInactive: true);

        foreach (Image img in allImages)
        {
            if (img.transform != transform) // Ensure the image is not the one attached to the same GameObject as this script
            {
                skillSlots.Add(img);
                TextMeshProUGUI countText = img.GetComponentInChildren<TextMeshProUGUI>(includeInactive: true);
                if (countText != null)
                {
                    skillCounts.Add(countText);
                }
            }
        }
    }

    void Start()
    {
        InitializeHotbar();
    }

    void Update()
    {
        UpdateHotbar();
        HandleSkillSelection();
    }

    // Initializes the hotbar to hide all skills initially
    private void InitializeHotbar()
    {
        foreach (var count in skillCounts)
        {
            count.text = "0"; // Start with empty text
        }
    }

    // Updates the hotbar based on the current skill counts
    private void UpdateHotbar() {
        int index = 0;
        foreach (SkillType skill in Enum.GetValues(typeof(SkillType))) {   
            //Debug.Log("Skill: " + skill);

            skillSlots[index].color = (index == selectedIndex) ? Color.yellow : Color.white;

            /*int count = playerSkills.GetSkillCount(skill);
            
            if (count > 0) {
                //skillSlots[index].enabled = true; // Enable the slot if skill is acquired
                skillCounts[index].text = skill.ToString() + ": " + count.ToString(); // Update the count
            }
            else {
                //skillSlots[index].enabled = false; // Disable the slot if no skills
                skillCounts[index].text = skill.ToString() + ": " +  "0";
            }
            */
            index++;
        }
    }

    // should do the same as UpdateHotbar, but only for the selected skill
    public void UpdateHotbarUI(SkillType skill, int count) {
        int index = (int) skill;
        skillCounts[index].text = skill.ToString() + ": " + count.ToString();
        skillSlots[index].color = (index == selectedIndex) ? Color.yellow : Color.white;

    }

    private void HandleSkillSelection() {
        if (Input.GetAxis("Mouse ScrollWheel") < 0f) {
            selectedIndex++;
            if (selectedIndex >= skillSlots.Count) selectedIndex = 0; // Loop around
        }
        else if (Input.GetAxis("Mouse ScrollWheel") > 0f) {
            selectedIndex--;
            if (selectedIndex < 0) selectedIndex = skillSlots.Count - 1; // Loop around
        }
    }
}