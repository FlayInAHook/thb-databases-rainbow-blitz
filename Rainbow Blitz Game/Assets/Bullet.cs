using UnityEngine;

public class Bullet : MonoBehaviour
{
    public float speed = 20f;
    public float lifetime = 5f;
    public int damage = 10; // Damage the bullet deals
    public ShootOrigin origin = ShootOrigin.Player;
    private void Start()
    {
        Destroy(gameObject, lifetime); // Destroy bullet after its lifetime
    }

    private void Update() {
      float distance = speed * Time.deltaTime;
      RaycastHit hit;

      if (Physics.Raycast(transform.position, transform.forward, out hit, distance)) {
          OnHit(hit.collider.gameObject);
      }

      // Move the bullet forward
      transform.Translate(Vector3.forward * distance);
    }

    private void OnHit(GameObject collidedObject){
      //Debug.Log("Bullet collided with " + collidedObject.name + " with tag " + collidedObject.tag);
      
      if (collidedObject.tag == "Bullet" || collidedObject.tag == "NonInteractable") return;
      if (origin == ShootOrigin.Player && collidedObject.tag == "Player") {
          return;
      }

      // Check if the collided object is a wall
      if (collidedObject.tag != "Player" && collidedObject.tag != "Destructable")
      {
          Destroy(gameObject);
          return;
      }

      

      // Check if the collided object has a health component
      DestructableHealth health = collidedObject.GetComponent<DestructableHealth>();
      if (health == null)
      {
          Debug.Log("No health component found on " + collidedObject.name);
          return;
      }
      health.TakeDamage(damage);

      Destroy(gameObject);
    }

    private void OnTriggerEnter(Collider other){
      OnHit(other.gameObject);
    }
}


public enum ShootOrigin { Player, Enemy }
