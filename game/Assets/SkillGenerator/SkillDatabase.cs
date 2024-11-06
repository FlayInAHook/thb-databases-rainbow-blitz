using UnityEngine;

[CreateAssetMenu(fileName = "Skill Database", menuName = "Skills/Skill Database")]
public class SkillDatabase : ScriptableObject
{
    public Skill[] skills;

    public Skill GetSkill(SkillType skillType)
    {
        foreach (Skill skill in skills)
        {
            if (skill.skillType == skillType)
            {
                return skill;
            }
        }
        Debug.LogWarning($"Skill of type {skillType} not found!");
        return null;
    }
}
