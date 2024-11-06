using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SkillOrb : MonoBehaviour
{
    public SkillType skill; // The skill this orb provides
    public bool isUnlimited; // Whether the orb is unlimited (for debugging)

    SkillDatabase skillDatabase;

    public MeshColorChanger meshColorChanger;

    private void Start()
    {
        skillDatabase = Resources.Load<SkillDatabase>("Skills/Skill Database"); // Load the skill database
        if (skillDatabase == null)
        {
            Debug.LogError("No SkillDatabase found in scene!");
        }
        meshColorChanger = GetComponent<MeshColorChanger>();
        StartCoroutine(InitializeAfterAllObjects());        
    }

    IEnumerator InitializeAfterAllObjects()
    {
        // Ensure all game objects have had their Start method called
        yield return new WaitForEndOfFrame();

        meshColorChanger.ChangeColor(skillDatabase.GetSkill(skill).skillColor); // Change the color of the orb based on the skill
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.gameObject.tag == "Player") // Make sure it's the player who touches the orb
        {
            PlayerSkills playerSkills = other.GetComponent<PlayerSkills>();
            if (playerSkills != null)
            {
                playerSkills.AcquireSkill(skill, isUnlimited); // Give the player the new skill
                if (!isUnlimited)
                {
                    Destroy(gameObject); // Destroy the orb if it's not unlimited
                }
            }
        }
    }
}
