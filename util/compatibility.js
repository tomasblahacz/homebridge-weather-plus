/*jshint esversion: 6,node: true,-W041: false */
"use strict";

const types = ["AirPressure", "CloudCover", "DewPoint", "Humidity", "RainBool", "SnowBool", "TemperatureMin", "TemperatureApparent", "UVIndex", "Visibility", "WindDirection", "WindSpeed", "RainDay"];

// 4 cardinal directions — each sensor activates when the wind direction string contains that letter.
// e.g. "NNW" activates both N and W, "SSE" activates both S and E.
const WIND_DIRS_4 = ['N', 'E', 'S', 'W'];

const createService = function (that, name, Service, Characteristic, CustomCharacteristic)
{
	if (name === "AirPressure")
	{
		// Get unit
		let temporaryService = new Service.OccupancySensor("Temporary");
		temporaryService.addCharacteristic(CustomCharacteristic.AirPressure);

		that.AirPressureService = new Service.OccupancySensor("Air Pressure", "Air Pressure");
		that.AirPressureService.unit = temporaryService.getCharacteristic(CustomCharacteristic.AirPressure).props.unit;
		that.AirPressureService.getCharacteristic(Characteristic.ConfiguredName).updateValue("Air Pressure");
	}
	if (name === "CloudCover")
	{
		that.CloudCoverService = new Service.OccupancySensor("Cloud Cover", "Cloud Cover");
		that.CloudCoverService.getCharacteristic(Characteristic.ConfiguredName).updateValue("Cloud Cover");
	}
	if (name === "DewPoint")
	{
		that.DewPointService = new Service.TemperatureSensor("Dew Point", "Dew Point");
		that.DewPointService.getCharacteristic(Characteristic.CurrentTemperature).props.minValue = -50;
		that.DewPointService.getCharacteristic(Characteristic.ConfiguredName).updateValue("Dew Point");
	}
	if (name === "Humidity")
	{
		that.HumidityService = new Service.HumiditySensor("Humidity");
	}
	if (name === "LightLevel")
	{
		that.LightLevelService = new Service.LightSensor("Light Level");
		that.LightLevelService.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
                                        .setProps({
                                                minValue: 0.0,
                                                maxValue: 200000.0
                                        });
	}
	if (name === "RainBool")
	{
		that.RainBoolService = new Service.ContactSensor("Rain", "Rain");
		that.RainBoolService.getCharacteristic(Characteristic.ConfiguredName).updateValue("Rain");
	}
	if (name === "SnowBool")
	{
		that.SnowBoolService = new Service.OccupancySensor("Snow", "Snow");
		that.SnowBoolService.getCharacteristic(Characteristic.ConfiguredName).updateValue("Snow");
	}
	if (name === "TemperatureMin")
	{
		that.TemperatureMinService = new Service.TemperatureSensor("Minimum Temperature", "TemperatureMin");
		that.TemperatureMinService.getCharacteristic(Characteristic.CurrentTemperature).props.minValue = -50;
		that.TemperatureMinService.getCharacteristic(Characteristic.ConfiguredName).updateValue("Minimum Temperature");
	}
	if (name === "TemperatureApparent")
	{
		that.TemperatureApparentService = new Service.TemperatureSensor("Apparent Temperature", "TemperatureApparent");
		that.TemperatureApparentService.getCharacteristic(Characteristic.CurrentTemperature).props.minValue = -50;
		that.TemperatureApparentService.getCharacteristic(Characteristic.ConfiguredName).updateValue("Apparent Temperature");
	}
	if (name === "UVIndex")
	{
		that.UVIndexService = new Service.OccupancySensor("UV Index", "UV Index");
		that.UVIndexService.getCharacteristic(Characteristic.ConfiguredName).updateValue("UV Index");
	}
	if (name === "Visibility")
	{
		// Get unit
		let temporaryService = new Service.OccupancySensor("Temporary");
		temporaryService.addCharacteristic(CustomCharacteristic.Visibility);

		that.VisibilityService = new Service.OccupancySensor("Visibility", "Visibility");
		that.VisibilityService.unit = temporaryService.getCharacteristic(CustomCharacteristic.Visibility).props.unit;
		that.VisibilityService.getCharacteristic(Characteristic.ConfiguredName).updateValue("Visibility");
	}
	if (name === "WindDirection")
	{
		// One ContactSensor per cardinal direction (N, E, S, W).
		// Multiple sensors can be active simultaneously — e.g. NNW activates both N and W —
		// so automations work without needing OR logic in HomeKit.
		WIND_DIRS_4.forEach(dir => {
			that['Wind' + dir + 'Service'] = new Service.ContactSensor('Wind ' + dir, 'Wind ' + dir);
			that['Wind' + dir + 'Service'].getCharacteristic(Characteristic.ConfiguredName).updateValue('Wind ' + dir);
		});
	}
	if (name === "WindSpeed")
	{
		// Get unit
		let temporaryService = new Service.OccupancySensor("Temporary");
		temporaryService.addCharacteristic(CustomCharacteristic.WindSpeed);

		that.WindSpeedService = new Service.ContactSensor("Wind Alert", "Wind Alert");
		that.WindSpeedService.unit = temporaryService.getCharacteristic(CustomCharacteristic.WindSpeed).props.unit;
		that.WindSpeedService.getCharacteristic(Characteristic.ConfiguredName).updateValue("Wind Alert");

		that.WindSpeedLevelService = new Service.TemperatureSensor("Wind Speed", "Wind Speed Level");
		that.WindSpeedLevelService.getCharacteristic(Characteristic.CurrentTemperature).setProps({
			minValue: 0,
			maxValue: 200,
			minStep: 0.1
		});
		that.WindSpeedLevelService.getCharacteristic(Characteristic.ConfiguredName).updateValue("Wind Speed");
	}
	if (name === "RainDay")
	{
		// Get unit
		let temporaryService = new Service.OccupancySensor("Temporary");
		temporaryService.addCharacteristic(CustomCharacteristic.RainDay);

		that.RainDayService = new Service.OccupancySensor("RainDay", "RainDay");
		that.RainDayService.unit = temporaryService.getCharacteristic(CustomCharacteristic.RainDay).props.unit;
		that.RainDayService.getCharacteristic(Characteristic.ConfiguredName).updateValue("RainDay");
	}

};

const getServices = function (that)
{
	let services = [];
	types.forEach((name) =>
	{
		if (name === "WindDirection")
		{
			WIND_DIRS_4.forEach(dir => {
				const key = 'Wind' + dir + 'Service';
				if (key in that) services.push(that[key]);
			});
		}
		else
		{
			let service = name + "Service";
			if (service in that) services.push(that[service]);
			if (name === "WindSpeed" && "WindSpeedLevelService" in that) services.push(that.WindSpeedLevelService);
		}
	});
	return services;
};

module.exports = {
	types,
	WIND_DIRS_4,
	createService,
	getServices
};
