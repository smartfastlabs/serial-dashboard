#include <Arduino.h>

int delayTime = 10;
long timeStamp = 0.;
double counter = 0.;
int randomValue = 0;

void setup()
{
  Serial.begin(115200);
  // set a parsing timeout of 10ms
  // (used by Serial.readString, parseInt, etc):
  Serial.setTimeout(10);
  // wait 3 secs if no remote serial connection is open:
  if (!Serial)
    delay(3000);
  Serial.println("Hello");
}

void loop()
{
  timeStamp = millis();
  counter++;
  Serial.print(">time:");
  Serial.println(timeStamp);
  Serial.print(">counter:");
  Serial.println(counter);

  double angle = fmod(counter / 100., 2 * 3.14);
  Serial.print(">angle:");
  Serial.println(angle);
  Serial.print(">sin:");
  Serial.println(sin(angle));
  Serial.print(">cos:");
  Serial.println(cos(angle));
  if (random(0, 100) > 95)
  {
    randomValue = random(0, 100);
  }
  Serial.print(">random:");
  Serial.println(randomValue);
  if (Serial.available() > 0)
  {
    int action = Serial.parseInt();
    int value = Serial.parseInt();
    if (action == 1)
    {
      delayTime = value;
      Serial.print(">delayTime:");
      Serial.println(delayTime);
    }
  }
  delay(10);
}