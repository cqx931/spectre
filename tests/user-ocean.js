import { expect } from 'chai';
import User from '../shared/user';

describe('OCEAN descriptions', function () {

  describe('User.generateDescription', function () {

    it('Should fail for a user without traits', function () {
      expect(() => new User().generateDescription()).to.throw();
    });

    it('Should describe a user based on OCEAN traits', function () {
      let user = new User(); //User.Create();
      user.name = "Jane";
      user.gender = "female";
      user.traits = {
        agreeableness: 0.3,
        conscientiousness: Math.random(),
        extraversion: Math.random(),
        openness: Math.random(),
        neuroticism: Math.random()
      }
      let result = user.generateDescription();
      //console.log(result);
      expect(result).is.a('string');
      expect(result.length).is.gt(0);
      expect(result.startsWith('Jane')).eq(true);
      expect(user.hasOceanTraits()).eq(true);
    });
  });

  describe('User.generateSentences()', function () {

    it('Should fail for a user without traits', function () {
      expect(() => new User().generateDescription()).to.throw();
    });

    it('Should describe a user with in k sentences', function () {
      let user = new User(); //User.Create();
      user.name = "Jane";
      user.gender = "female";
      user.traits = User._randomTraits();
      let result = user.generateSentences(3);
      console.log(result);
      expect(result).is.a('array');
      expect(result.length).is.eq(3);
      expect(result[0].startsWith('Jane')).eq(true);
      expect(result[1].startsWith('Jane')).eq(false);
      expect(result[2].startsWith('Jane')).eq(false);
    });
  });
});
