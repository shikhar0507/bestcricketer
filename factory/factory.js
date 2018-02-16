app.factory('helper', function () {

	var obj = {};
	var dataArray = [];
	return {



		parse: function (val, parser) {

			var regex = new RegExp("[" + parser + "]$");

			for (var i = 0; i < val.length; i++) {

				val[i].opposition = val[i].opposition.replace("v", '').replace(" ", '');

				if (regex.test(val[i].batting_score)) {

					val[i].batting_score = val[i].batting_score.replace(regex, "");

				}


				if (val[i].batting_score != "DNB" && val[i].batting_score != "TDNB") {

					val[i].batting_score = parseInt(val[i].batting_score);
					dataArray.push(val[i]);
				}



			}

			return dataArray;

		},

		score: function (val, league) {

			var totalRuns = [];
			var hasWon = [];
			var hasLost = [];
			totalRuns.push(val.map(function (q) {
				return q.batting_score
			}));

			var scoreData = {
				totalCenturies: function (opp) {

					var centuryAgaistOpp = [];
					var sc = {};
					if (opp) {
						val.map(function (s) {

							if (s.batting_score >= league && s.opposition === opp) {
								sc[s.date] = s.batting_score
							}
						});

						return sc;
					} else {
						val.map(function (s) {
							
							if (s.batting_score >= 100) {
								sc[s.date] = s.batting_score
							}
						});

						return sc;
					}

				},
				result: function () {
										
					var isSelfish = {};
					val.map(function (q) {

						if (q.match_result === "won" && q.batting_score >= league) {
							hasWon.push(q)

						} else if (q.match_result === "lost" && q.batting_score >= league) {
							hasLost.push(q);
						}

					});

					isSelfish["won"] = hasWon;
					isSelfish["lost"] = hasLost;
					
					
					if (hasWon.length > hasLost.length) {
						 isSelfish["selfish"] = "no"
					} else {
						 isSelfish["selfish"] = "yes"
					}
					
					return isSelfish;

				},
				totalRuns: function () {
					return totalRuns[0].reduce(function (a, b) {
						return a + b;
					});
				}
			};
			return scoreData;
		},

		sortByOpposition: function (val, country) {

			var holder = {};
			val.forEach(function (d) {

				if (holder.hasOwnProperty(d.opposition)) {
					holder[d.opposition] = holder[d.opposition] + d.batting_score;
				} else {
					holder[d.opposition] = d.batting_score;
				}
			})

			if (country) {
				newObj = {};
				newObj[country] = holder[country];
				return newObj;
			} else {
				return holder;
			}
		},
	}

})

app.factory('d3', [function () {
	return d3;
}])

app.factory('nv', [function () {
	return nv;
}])