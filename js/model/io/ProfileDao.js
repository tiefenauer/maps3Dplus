define([
	'backbone',
	'THREE',
	'model/io/STLLoader'
	], 
	function(Backbone, THREE){

	var ProfileDao = Backbone.Model.extend({

		loader: null,

		initialize: function(attributes, options){
			console.log('new ProfileDao created');
			var self = this;
			this.loader = new THREE.STLLoader();
			this.loader.addEventListener('load', function(event){
				var geometry = event.content;
				self.trigger('io:model:loaded', geometry);
			});
		},

		load: function(file){
			console.log('Loading from ' + file + ' ...');
			this.loader.loadLocal(file);
		},

		save: function(fileName, models){
			var modelNames = "";
			models.forEach(function(model){
				modelNames += model.name + ", ";
			});
			console.log('Saving ' + modelNames + ' to ' + fileName + '.stl ...');
			var stl = this.generateStl(models[0].geometry);			
			var blob = new Blob([stlString], {type: 'text/plain'});
			var fs = new FileSaver();
			fs.saveAs(blob, fileName + ".stl");
		},

		generateStl: function(geometry){			
			var vertices = geometry.vertices;
			var tris     = geometry.faces;

			var stringifyVertex = function(vec){
  				return "vertex "+vec.x+" "+vec.y+" "+vec.z+" \n";
			}

			var stl = "solid pixel";
			for(var i = 0; i<tris.length; i++){
				stl += ("facet normal "+stringifyVector( tris[i].normal )+" \n");
				stl += ("outer loop \n");
				stl += stringifyVertex( vertices[ tris[i].a ]);
				stl += stringifyVertex( vertices[ tris[i].b ]);
				stl += stringifyVertex( vertices[ tris[i].c ]);
				stl += ("endloop \n");
				stl += ("endfacet \n");
			}
			stl += ("endsolid");

			return stl
		}


	});
	return ProfileDao;
});