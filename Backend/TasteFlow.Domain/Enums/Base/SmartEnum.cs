using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace TasteFlow.Domain.Enums.Base
{
    public abstract class SmartEnum<T> where T : SmartEnum<T>
    {
        public Guid Id { get; }
        public string Name { get; }

        protected SmartEnum(Guid id, string name)
        {
            Id = id;
            Name = name;
        }

        public override int GetHashCode() => Id.GetHashCode();

        public override bool Equals(object? obj) => Equals(obj as T);

        public static IEnumerable<T> GetValues()
        {
            return typeof(T).GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.DeclaredOnly)
                .Where(f => f.FieldType == typeof(T))
                .Select(f => (T)f.GetValue(null)!);
        }

        public override string ToString() => Name;
    }
}
